// scripts/run_eval_benchmark.mjs
/**
 * 22Annex.ai Evaluation Benchmark Runner
 *
 * Führt alle 5 Kernszenarien des Ground Truth Benchmarks aus.
 * Modus:
 *   - Offline / Heuristik (Default): Schnell & deterministisch
 *   - Live (--live): Sendet die Prompts an Google AI Studio (Gemma 4 31B mit Fallback)
 *
 * Aufruf:
 *   node scripts/run_eval_benchmark.mjs
 *   node scripts/run_eval_benchmark.mjs --live
 */

import {
  SCENARIO_BENCHMARKS,
  CANDIDATE_MODELS,
  calculateLiveScore,
  extractParametersHeuristically,
  buildCoAuditorPrompt,
  parseCoAuditorResponse,
  generateExpertBlueprint
} from '../src/simulator-engine.js';

// Lade .env.local falls vorhanden
try {
  process.loadEnvFile('.env.local');
} catch (e) {
  // Ignorieren falls keine .env.local da ist
}

const isLive = process.argv.includes('--live');
const apiKey = process.env.VITE_GEMINI_API_KEY || '';

console.log('='.repeat(70));
console.log('🧪 22Annex.ai Benchmark Runner — EU GMP Annex 22');
console.log(`Modus: ${isLive ? '⚡ LIVE (Google AI Studio Gemma 4 Backend)' : '📋 OFFLINE / HEURISTIK'}`);
if (isLive) {
  console.log(`API Key vorhanden: ${Boolean(apiKey && apiKey.length > 5)}`);
  console.log(`Modellkaskade: ${CANDIDATE_MODELS.join(' -> ')}`);
}
console.log('='.repeat(70));

async function callLiveLLM(prompt) {
  let lastError = null;
  for (const model of CANDIDATE_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    const start = performance.now();
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      });

      if (!res.ok) {
        const errText = await res.text();
        lastError = new Error(`${model} (HTTP ${res.status}): ${errText}`);
        continue;
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const latency = Math.round(performance.now() - start);
      if (text.trim().length > 0) {
        return { model, text: text.trim(), latency };
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw new Error(`Alle Live-Modelle fehlgeschlagen: ${lastError?.message}`);
}

async function runBenchmark() {
  let passedCount = 0;
  let totalCount = SCENARIO_BENCHMARKS.length;
  const results = [];

  for (let i = 0; i < totalCount; i++) {
    const scn = SCENARIO_BENCHMARKS[i];
    console.log(`\n▶ [${i + 1}/${totalCount}] ${scn.name}`);
    console.log(`  ID: ${scn.id}`);
    console.log(`  Input: "${scn.prompt.slice(0, 90)}..."`);

    let extracted = null;
    let auditorReply = '';
    let liveMeta = null;

    if (isLive && apiKey) {
      const prompt = buildCoAuditorPrompt(scn.prompt, {});
      try {
        const liveRes = await callLiveLLM(prompt);
        liveMeta = liveRes;
        const parsed = parseCoAuditorResponse(liveRes.text, {});
        extracted = parsed.extractedParameters;
        auditorReply = parsed.auditorReply;
        console.log(`  Backend: ${liveRes.model} (${liveRes.latency}ms)`);
      } catch (err) {
        console.warn(`  ⚠️ Live-Aufruf fehlgeschlagen (${err.message}), nutze Heuristik.`);
        extracted = extractParametersHeuristically(scn.prompt);
      }
    } else {
      extracted = extractParametersHeuristically(scn.prompt);
    }

    const { score, penalties, flags } = calculateLiveScore(extracted);
    const blueprint = generateExpertBlueprint(extracted);

    // Kriterien-Prüfung
    let testPassed = true;
    const notes = [];

    if (scn.expected.learningType && extracted.learningType !== scn.expected.learningType) {
      testPassed = false;
      notes.push(`Mismatch learningType: expected '${scn.expected.learningType}', got '${extracted.learningType}'`);
    }

    if (scn.expected.autonomyLevel && extracted.autonomyLevel !== scn.expected.autonomyLevel) {
      testPassed = false;
      notes.push(`Mismatch autonomyLevel: expected '${scn.expected.autonomyLevel}', got '${extracted.autonomyLevel}'`);
    }

    if (scn.expected.verdict && blueprint.verdict !== scn.expected.verdict) {
      testPassed = false;
      notes.push(`Mismatch verdict: expected '${scn.expected.verdict}', got '${blueprint.verdict}'`);
    }

    if (scn.expected.scoreRange) {
      const [minS, maxS] = scn.expected.scoreRange;
      if (score < minS || score > maxS) {
        testPassed = false;
        notes.push(`Score ${score}% out of range [${minS}%, ${maxS}%]`);
      }
    }

    if (scn.expected.mustContainFlag) {
      const hasFlag = flags.some(f => f.title.includes(scn.expected.mustContainFlag));
      if (!hasFlag) {
        testPassed = false;
        notes.push(`Missing mandatory flag: '${scn.expected.mustContainFlag}'`);
      }
    }

    if (testPassed) {
      passedCount++;
      console.log(`  Status: ✅ PASSED`);
    } else {
      console.log(`  Status: ❌ FAILED`);
      notes.forEach(n => console.log(`    - ${n}`));
    }

    console.log(`  Extrahierte Parameter: ${extracted.modelType} | ${extracted.learningType} | ${extracted.autonomyLevel} | ${extracted.processArea}`);
    console.log(`  Score: ${score}% | Verdict: ${blueprint.verdict}`);
    if (auditorReply) {
      console.log(`  Co-Auditor Feedback: "${auditorReply.slice(0, 120)}..."`);
    }

    results.push({
      id: scn.id,
      name: scn.name,
      passed: testPassed,
      score,
      verdict: blueprint.verdict,
      notes,
      liveMeta
    });
  }

  console.log('\n' + '='.repeat(70));
  console.log(`📊 Benchmark-Ergebnis: ${passedCount} von ${totalCount} Szenarien bestanden (${Math.round((passedCount / totalCount) * 100)}%)`);
  console.log('='.repeat(70));

  if (passedCount < totalCount) {
    process.exitCode = 1;
  }
}

runBenchmark().catch(err => {
  console.error('Fatal benchmark error:', err);
  process.exitCode = 1;
});
