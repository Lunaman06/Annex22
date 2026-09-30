// src/simulator-engine.js
/**
 * 22Annex.ai Simulation & Co-Auditor Engine
 * Normative Rule-Engine, Prompt Builders, Parameter Extractors and Blueprint Generator.
 * Compatible with ES Modules in both Browser and Node.js test environments.
 */

export const CANDIDATE_MODELS = [
  'gemma-4-31b-it',
  'gemma-4-26b-a4b-it',
  'gemini-3-flash-preview',
  'gemini-3.5-flash',
  'gemini-flash-latest'
];

export const SCENARIO_BENCHMARKS = [
  {
    id: 'SCN-01-DYNAMIC-LEARNING',
    name: 'K.O. Dynamisches Selbstlernen im GMP-Betrieb [Draft §1]',
    prompt: 'Wir entwickeln ein ML-Modell für unseren Bioreaktor zur Titer-Optimierung. Das Modell soll sich im laufenden Batchbetrieb kontinuierlich an neuen Sensorsignalen selbst weitertrainieren (Online Continual Learning), um Prozessschwankungen sofort adaptiv auszugleichen.',
    expected: {
      processArea: 'in_process',
      modelType: 'predictive_ml',
      learningType: 'dynamic',
      verdict: 'REJECT',
      scoreRange: [30, 65],
      mustContainFlag: 'Dynamisches Selbstlernen'
    }
  },
  {
    id: 'SCN-02-HOOL-AUTONOMY',
    name: 'K.O. Vollautonome Entscheidungen / HOOL [Draft §3, §9.2]',
    prompt: 'Wir planen ein autonomes KI-System, das Abweichungsberichte (Deviations) und OOS-Laborergebnisse vollautomatisch bewertet, abschließt und die Freigabe ohne jegliche menschliche Gegenprüfung durchführt (Human-out-of-the-Loop), um Durchlaufzeiten zu halbieren.',
    expected: {
      processArea: 'oos_investigation',
      autonomyLevel: 'hool',
      verdict: 'REJECT',
      scoreRange: [30, 70],
      mustContainFlag: 'Vollautonomie'
    }
  },
  {
    id: 'SCN-03-VISION-VIAL-INSPECTION',
    name: 'Optische Vial-Inspektion (Computer Vision) [Draft §6, §7]',
    prompt: 'Wir implementieren ein Convolutional Neural Network (CNN) mit Frozen Weights an unserer sterilen Abfülllinie für Parenteralia. Es analysiert Hochgeschwindigkeits-Kamerabilder von Vials auf Glasrisse, Partikel und Bördelkappenfehler. Fehlerhafte Vials werden automatisch ausgeschleust; ein geschulter GMP-Bediener führt statistische Stichprobenkontrollen durch und kann das System jederzeit überstimmen (Human-in-the-Loop).',
    expected: {
      processArea: 'in_process',
      modelType: 'vision_defect',
      learningType: 'static',
      autonomyLevel: 'hitl',
      verdict: 'VALIDATION_READY',
      scoreRange: [80, 100],
      mustNotContainFlag: 'Showstopper'
    }
  },
  {
    id: 'SCN-04-GENAI-RAG-ASSISTANT',
    name: 'RAG-basierter GenAI SOP & Deviation Assistant [Draft §8]',
    prompt: 'Wir möchten einen internen RAG-Assistenten auf Basis eines Large Language Models einführen. Das System durchsucht freigegebene SOPs und LIMS-Historien, um QA-Mitarbeitern Formulierungshilfen und Erstentwürfe für CAPA- und Abweichungsberichte zu liefern. Jedes Dokument wird manuell von einem Senior QA Manager geprüft und per digitaler Signatur nach Annex 11 freigegeben.',
    expected: {
      processArea: 'oos_investigation',
      modelType: 'genai_rag',
      learningType: 'static',
      autonomyLevel: 'hitl',
      verdict: 'CONDITIONAL',
      scoreRange: [70, 90]
    }
  },
  {
    id: 'SCN-05-VAGUE-INTAKE',
    name: 'Vage Projektanfrage (Intake Sparring erforderlich)',
    prompt: 'Wir überlegen, irgendwie KI bei uns an der Verpackungslinie einzusetzen, um Prozesse zu optimieren und Fehler zu reduzieren.',
    expected: {
      verdict: 'INCOMPLETE',
      needsClarification: true
    }
  }
];

/**
 * Berechnet den Live Readiness Score und identifiziert regulatorische Red Flags.
 */
export function calculateLiveScore(simState, lang = 'de') {
  const s = simState || {};
  let score = 100;
  const penalties = [];
  const flags = [];

  // 1. Dynamic Learning Penalty (Draft §1)
  if (s.learningType === 'dynamic') {
    score -= 35;
    penalties.push({
      label: lang === 'de' ? 'Dynamisches Selbstlernen im GMP-Betrieb' : 'Dynamic self-learning in GMP',
      deduction: -35,
      citation: '[Draft §1]'
    });
    flags.push({
      title: lang === 'de' ? 'Kritisches Finding: Dynamisches Selbstlernen' : 'Critical Finding: Dynamic Continuous Learning',
      ref: 'EU GMP Annex 22 [Draft §1]',
      reference: 'EU GMP Annex 22 [Draft §1]',
      desc: lang === 'de' 
        ? 'Kontinuierliches Nachtrainieren im GMP-Routinebetrieb ist nicht zulässig („should not be used“). Es drohen unkontrollierter Modell-Drift und Verlust des validierten Zustands. Lösung: Frozen Weights mit kontrolliertem Offline-Retraining unter Change Control.'
        : 'Continuous self-learning in GMP routine operation is not permitted. Risk of uncontrolled drift and invalid state. Remediation: Frozen weights with offline retraining under change control.',
      description: lang === 'de' 
        ? 'Kontinuierliches Nachtrainieren im GMP-Routinebetrieb ist nicht zulässig („should not be used“). Es drohen unkontrollierter Modell-Drift und Verlust des validierten Zustands. Lösung: Frozen Weights mit kontrolliertem Offline-Retraining unter Change Control.'
        : 'Continuous self-learning in GMP routine operation is not permitted. Risk of uncontrolled drift and invalid state. Remediation: Frozen weights with offline retraining under change control.'
    });
  }

  // 2. Full Autonomy / HOOL Penalty (Draft §3, §9.2)
  if (s.autonomyLevel === 'hool' && (s.processArea === 'batch_release' || s.processArea === 'in_process' || s.processArea === 'oos_investigation')) {
    score -= 30;
    penalties.push({
      label: lang === 'de' ? 'Vollautonomie bei qualitätskritischer Freigabe' : 'Full autonomy on critical release',
      deduction: -30,
      citation: '[Draft §3, §9.2]'
    });
    flags.push({
      title: lang === 'de' ? 'Kritisches Finding: Unzulässige Vollautonomie (HOOL)' : 'Critical Finding: Unsupervised Autonomy (HOOL)',
      ref: 'EU GMP Annex 22 [Draft §3, §9.2] & Art. 51 2001/83/EG',
      reference: 'EU GMP Annex 22 [Draft §3, §9.2] & Art. 51 2001/83/EG',
      desc: lang === 'de'
        ? 'Qualitätskritische Entscheidungen und Freigaben dürfen nicht vollständig an KI delegiert werden. Ein Human-in-the-Loop mit dokumentierter Override-Befugnis ist zwingend erforderlich.'
        : 'Quality-critical decisions and batch release must not be fully delegated to AI without qualified human oversight.',
      description: lang === 'de'
        ? 'Qualitätskritische Entscheidungen und Freigaben dürfen nicht vollständig an KI delegiert werden. Ein Human-in-the-Loop mit dokumentierter Override-Befugnis ist zwingend erforderlich.'
        : 'Quality-critical decisions and batch release must not be fully delegated to AI without qualified human oversight.'
    });
  }

  // 3. Public Cloud Data Penalty (Draft §5, §6)
  if (s.dataSource === 'public_cloud') {
    score -= 15;
    penalties.push({
      label: lang === 'de' ? 'Unverifizierte Public Cloud Daten / IP-Risiko' : 'Public cloud / unverified data source',
      deduction: -15,
      citation: '[Draft §5, §6]'
    });
  }

  // 4. GenAI Stochasticity Penalty (Draft §8)
  if (s.modelType === 'genai_rag') {
    score -= 10;
    penalties.push({
      label: lang === 'de' ? 'GenAI Stochastik & Halluzinationsrisiko' : 'GenAI stochasticity & hallucination risk',
      deduction: -10,
      citation: '[Draft §8, GAMP Guide 2025]'
    });
  }

  score = Math.max(10, Math.min(100, score));
  return { score, penalties, flags };
}

/**
 * Heuristische Extraktion aus Freitext (robuster Offline-Fallback).
 */
export function extractParametersHeuristically(userText, currentState = {}) {
  const clean = (userText || '').trim();
  const lower = clean.toLowerCase();
  const next = {
    projectName: currentState.projectName || '',
    intendedUse: currentState.intendedUse || '',
    processArea: currentState.processArea || 'in_process',
    modelType: currentState.modelType || 'predictive_ml',
    learningType: currentState.learningType || 'static',
    autonomyLevel: currentState.autonomyLevel || 'hitl',
    dataSource: currentState.dataSource || 'internal_gxp',
    ...currentState
  };

  // Vage-Erkennung
  const isVague = lower.includes('irgendwie') || lower.includes('noch nicht genau') || (lower.includes('überlegen') && !lower.includes('frozen'));
  next.isVague = isVague;
  if (!next.intendedUse || next.intendedUse.length < clean.length) {
    next.intendedUse = clean;
  }

  // Erkennung von Projekt-Typ & Intended Use
  if (lower.includes('vial') || lower.includes('partikel') || lower.includes('optisch') || lower.includes('kamera') || lower.includes('vision') || lower.includes('parenteralia')) {
    next.projectName = next.projectName && next.projectName !== 'Unbenannt' ? next.projectName : 'AI-Vision Inspektion Parenteralia';
    next.intendedUse = clean;
    next.processArea = 'in_process';
    next.modelType = 'vision_defect';
  } else if (lower.includes('genai') || lower.includes('sop') || lower.includes('rag') || lower.includes('llm') || lower.includes('abweichung') || lower.includes('deviation') || lower.includes('capa')) {
    next.projectName = next.projectName && next.projectName !== 'Unbenannt' ? next.projectName : 'GenAI SOP & Deviation Drafting Assistant';
    next.intendedUse = clean;
    next.processArea = 'oos_investigation';
    next.modelType = 'genai_rag';
  } else if (lower.includes('bioreaktor') || lower.includes('ferment') || lower.includes('sensor') || lower.includes('ausbeute') || lower.includes('titer')) {
    next.projectName = next.projectName && next.projectName !== 'Unbenannt' ? next.projectName : 'Bioprozess-Monitoring & Soft-Sensor';
    next.intendedUse = clean;
    next.processArea = 'in_process';
    next.modelType = 'predictive_ml';
  } else if (lower.includes('chargenfreigabe') || lower.includes('batch release') || lower.includes('qp') || lower.includes('freigabe')) {
    next.processArea = 'batch_release';
  }

  // Erkennung von Lernmodus (Static vs Dynamic)
  if (lower.includes('dynamisch') || lower.includes('kontinuierlich') || lower.includes('selbstlern') || lower.includes('online')) {
    next.learningType = 'dynamic';
  } else if (lower.includes('froz') || lower.includes('freeze') || lower.includes('statisch') || lower.includes('fest') || lower.includes('eingefroren')) {
    next.learningType = 'static';
  }

  // Erkennung von Autonomiegrad: HOOL zuerst prüfen wegen Phrasen wie "ohne mensch" oder "human-out-of-the-loop"
  if (lower.includes('hool') || lower.includes('out-of-the-loop') || lower.includes('vollautomat') || lower.includes('ohne mensch') || lower.includes('autonom')) {
    next.autonomyLevel = 'hool';
  } else if (lower.includes('hotl') || lower.includes('leitwarte') || lower.includes('not-aus')) {
    next.autonomyLevel = 'hotl';
  } else if (lower.includes('hitl') || lower.includes('in-the-loop') || lower.includes('override') || lower.includes('stichprobe') || lower.includes('prüft') || lower.includes('mensch')) {
    next.autonomyLevel = 'hitl';
  }

  // Erkennung von Datenquellen
  if (lower.includes('cloud') && (lower.includes('public') || lower.includes('offen'))) {
    next.dataSource = 'public_cloud';
  } else if (lower.includes('lims') || lower.includes('sap') || lower.includes('intern') || lower.includes('gxp')) {
    next.dataSource = 'internal_gxp';
  }

  return next;
}

/**
 * Erstellt den Prompt für Gemma 4 31B (Co-Auditor).
 */
export function buildCoAuditorPrompt(userText, currentSimState = {}, lang = 'de') {
  const s = currentSimState;
  return `Du bist ein führender GxP-Inspektor der Europäischen Arzneimittel-Agentur (EMA) und PIC/S für den Draft EU GMP Annex 22 (Künstliche Intelligenz und maschinelles Lernen in der pharmazeutischen Produktion).

Deine Aufgabe:
Analysiere die folgende Projekteingabe eines Pharma-Ingenieurs/Data-Scientists.

Aktueller Systemstatus vor dieser Eingabe:
- Projekttitel: ${s.projectName || 'Noch nicht erfasst'}
- Bisheriger Intended Use: ${s.intendedUse || 'Noch nicht erfasst'}
- Prozessbereich: ${s.processArea || 'in_process'}
- Modelltyp: ${s.modelType || 'predictive_ml'}
- Lernmodus: ${s.learningType || 'static'}
- Autonomiegrad: ${s.autonomyLevel || 'hitl'}
- Datenquelle: ${s.dataSource || 'internal_gxp'}

Neue Nachricht des Nutzers:
"${userText}"

Regulatorische Bewertungsleitplanken (Annex 22):
1. [Draft §1]: Dynamisches Selbstlernen im Routinebetrieb ist de facto verboten ("should not be used"). Gefordert: Frozen Weights mit kontrolliertem Offline-Retraining.
2. [Draft §3, §9.2]: Qualitätsentscheidungen dürfen niemals vollautonom (HOOL) ohne menschliche Verantwortung getroffen werden (Art. 51 2001/83/EG). Gefordert: HITL mit dokumentierter Override-Befugnis und Schutz vor Automation Bias.
3. [Draft §6]: Testdaten-Isolation: Entwickler dürfen keinen Zugriff auf finale Testdaten haben (Hold-out-Isolation).
4. [Draft §8]: GenAI/LLMs dürfen nur als Drafting-Assistent mit RAG und Halluzinationsschranke eingesetzt werden.
5. Bei vagen Anfragen: Keine vorschnelle Freigabe, sondern präzise Leitfragen stellen.

Antworte im folgenden JSON-Format (ausschließlich valides JSON):
{
  "auditorReply": "Deine direkte, fachlich präzise Antwort als Co-Auditor auf Deutsch. Hebe regulatorische Konsequenzen hervor, nenne konkrete Paragraphen ([Draft §1], [Draft §3], etc.) und stelle bei Bedarf die nächste gezielte Leitfrage.",
  "extractedParameters": {
    "projectName": "Prägnanter Name oder bestehender",
    "intendedUse": "Zweckbestimmung",
    "processArea": "batch_release" | "in_process" | "oos_investigation",
    "modelType": "vision_defect" | "predictive_ml" | "genai_rag",
    "learningType": "static" | "dynamic",
    "autonomyLevel": "hitl" | "hotl" | "hool",
    "dataSource": "internal_gxp" | "hybrid" | "public_cloud"
  },
  "isVague": boolean,
  "detectedRedFlags": ["Optional: Liste von Showstoppern falls zutreffend"]
}`;
}

/**
 * Robuster Parser für Co-Auditor-Antworten (Gemma 4 31B JSON or Markdown).
 */
export function parseCoAuditorResponse(rawText, fallbackState = {}, lang = 'de') {
  if (!rawText || typeof rawText !== 'string') {
    return {
      auditorReply: lang === 'de' ? 'Entschuldigung, die Antwort konnte nicht verarbeitet werden.' : 'Sorry, response could not be parsed.',
      extractedParameters: { ...fallbackState },
      isVague: false
    };
  }

  // 1. Bereinige JSON-Codeblöcke
  let cleaned = rawText.trim();
  if (cleaned.includes('```json')) {
    cleaned = cleaned.replace(/^[\s\S]*?```json/i, '').replace(/```[\s\S]*$/, '').trim();
  } else if (cleaned.includes('```')) {
    cleaned = cleaned.replace(/^[\s\S]*?```/i, '').replace(/```[\s\S]*$/, '').trim();
  }

  // 2. Versuche JSON Parse
  try {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const params = parsed.extractedParameters || {};
      const validProcessAreas = ['batch_release', 'in_process', 'oos_investigation'];
      const validModelTypes = ['vision_defect', 'predictive_ml', 'genai_rag'];
      const validLearningTypes = ['static', 'dynamic'];
      const validAutonomyLevels = ['hitl', 'hotl', 'hool'];

      const mergedParams = {
        projectName: params.projectName || fallbackState.projectName,
        intendedUse: params.intendedUse || fallbackState.intendedUse,
        processArea: validProcessAreas.includes(params.processArea) ? params.processArea : fallbackState.processArea,
        modelType: validModelTypes.includes(params.modelType) ? params.modelType : fallbackState.modelType,
        learningType: validLearningTypes.includes(params.learningType) ? params.learningType : fallbackState.learningType,
        autonomyLevel: validAutonomyLevels.includes(params.autonomyLevel) ? params.autonomyLevel : fallbackState.autonomyLevel,
        dataSource: params.dataSource || fallbackState.dataSource
      };

      return {
        auditorReply: parsed.auditorReply || rawText,
        extractedParameters: mergedParams,
        isVague: Boolean(parsed.isVague),
        detectedRedFlags: parsed.detectedRedFlags || []
      };
    }
  } catch (err) {
    console.warn('JSON parsing failed, falling back to heuristic parsing:', err);
  }

  // 3. Fallback: Reines Textparsing mit Heuristik
  const heuristicParams = extractParametersHeuristically(rawText, fallbackState);
  return {
    auditorReply: rawText.replace(/```json[\s\S]*?```/g, '').trim(),
    extractedParameters: heuristicParams,
    isVague: false,
    detectedRedFlags: []
  };
}

/**
 * Generiert ein vollständiges, prüfsicheres Validierungs-Dossier (Blueprint).
 */
export function generateExpertBlueprint(simState, lang = 'de') {
  const s = simState || {};
  const { score, penalties, flags } = calculateLiveScore(s, lang);
  const redFlags = [...flags];
  const deliverables = [];
  const testingRequirements = [];
  const auditQuestions = [];
  let verdict = score >= 80 ? 'VALIDATION_READY' : (score >= 50 ? 'CONDITIONAL' : 'REJECT');

  // K.O. Kriterien erzwingen sofortiges REJECT
  if (s.learningType === 'dynamic') {
    verdict = 'REJECT';
  }
  if (s.autonomyLevel === 'hool' && (s.processArea === 'batch_release' || s.processArea === 'in_process' || s.processArea === 'oos_investigation')) {
    verdict = 'REJECT';
  }

  // Vage oder unvollständige Anfragen
  if (s.isVague || (s.intendedUse && s.intendedUse.toLowerCase().includes('irgendwie'))) {
    verdict = 'INCOMPLETE';
  }

  // 1. Check Dynamic Learning
  if (s.learningType === 'dynamic' && !redFlags.some(f => f.title.includes('Dynamisches'))) {
    redFlags.push({
      title: 'Verstoß gegen das Verbot dynamisch selbstlernender Modelle',
      reference: 'EU GMP Annex 22 [Draft §1] (Modul 03 / Modul 07)',
      description: 'Der Entwurf von Annex 22 schließt Modelle, die sich im GMP-Routinebetrieb selbstständig weitertrainieren, kategorisch aus. Das Modell muss mit fest gefrorenen Parametern (Frozen Weights) betrieben werden. Retrainings erfordern eine isolierte Offline-Umgebung und einen formalen Revalidierungsbericht.'
    });
  }

  // 2. Check HOOL on critical tasks
  if (s.autonomyLevel === 'hool' && (s.processArea === 'batch_release' || s.processArea === 'in_process' || s.processArea === 'oos_investigation') && !redFlags.some(f => f.title.includes('Vollautonomie'))) {
    redFlags.push({
      title: 'Unzulässige Vollautonomie (HOOL) bei qualitätskritischen Entscheidungen',
      reference: 'EU GMP Annex 22 [Draft §3, §9.2] & Art. 51 Richtlinie 2001/83/EG',
      description: 'KI-Systeme besitzen keine pharmazeutische Rechtsverantwortung. Vollautomatische Chargenfreigaben ohne qualifizierte menschliche Prüfung verstoßen gegen europäisches Arzneimittelrecht. Es muss zwingend ein Human-in-the-Loop (HITL) Workflow implementiert sein.'
    });
  }

  // 3. GenAI Checks
  if (s.modelType === 'genai_rag') {
    if (verdict !== 'REJECT') verdict = 'CONDITIONAL';
    deliverables.push({
      name: 'RAG-First Architektur-Spezifikation & Guardrail-Protokoll',
      tier: 'Tier 2 (System)',
      requirements: 'Nachweis, dass das LLM strikt auf freigegebene interne Dokumente beschränkt ist (kein freies Internet). Eingangs-Filter (Prompt Injection / PII) und Ausgangs-Guardrails (Schema Enforcement).'
    });
    deliverables.push({
      name: 'Prompt Governance & Golden Regression Testsuite',
      tier: 'Tier 3 (Technisch)',
      requirements: 'Prompts müssen als validierter Source Code in Git versioniert sein. Automatisierte Testsuite mit mind. 100 verifizierten Standardfragen zum Erkennen von Provider-Backend-Updates.'
    });
    testingRequirements.push({
      metric: 'RAG Triad: Groundedness / Faithfulness = 1.0',
      purpose: 'Halluzinations-Prävention',
      details: 'Jede generierte Behauptung muss zu 100% mathematisch aus den abgerufenen Kontext-SOPs belegbar sein. ALCOA+-Zitierpflicht (Dokument-ID, Version, Absatz).'
    });
    auditQuestions.push({
      question: 'Wie stellen Sie sicher, dass Ihr Cloud-Sprachmodell keine erfundenen pharmazeutischen Fakten (Halluzinationen) in den Bericht übernimmt?',
      recommendedAnswer: 'Durch unsere validierte RAG-Triad-Pipeline und den Groundedness-Filter. Sinkt die Faktentreue unter 1.0, verweigert das System die Ausgabe. Zudem fungiert das Tool rein als Drafting Assistant mit zwingender QP-Prüfung.'
    });
  } else {
    // Predictive ML / Vision Deliverables
    deliverables.push({
      name: 'Model Definition & Intended Use Specification',
      tier: 'Tier 2 (System)',
      requirements: 'Formale Festlegung der Systemgrenzen, Eingangs-Sensorparameter und Out-of-Distribution (OOD) Erkennungslogik.'
    });
    deliverables.push({
      name: 'Unabhängiger Validierungsplan & Metric Quad Bericht',
      tier: 'Tier 2 (Qualifizierung)',
      requirements: 'Durchführung der OQ/PQ durch personell unabhängige Tester (Staff Independence) auf einem unverbrauchten Hold-out Testdatensatz.'
    });
    testingRequirements.push({
      metric: 'Recall (Sensitivität) ≥ 99.5% (Pre-Sealed)',
      purpose: 'Schutz vor False Negatives',
      details: 'Asymmetrische Fehlerkosten: Eine defekte Einheit darf niemals unentdeckt bleiben. Akzeptanzkriterien müssen vor Testdurchführung versiegelt werden.'
    });
    testingRequirements.push({
      metric: 'Expected Calibration Error (ECE) ≤ 0.05',
      purpose: 'Schutz vor Automation Bias',
      details: 'Verhindert, dass das Modell bei Fehlentscheidungen fälschlich hohe Konfidenzen anzeigt und das Bedienpersonal täuscht.'
    });
    auditQuestions.push({
      question: 'Waren die Ingenieure, die den finalen Validierungstest durchgeführt haben, unabhängig vom Entwicklungsteam?',
      recommendedAnswer: 'Ja, gemäß PIC/S- und Annex-22-Vorgaben wurde die Qualifizierung auf dem versiegelten Hold-out-Set von unabhängigen Validierungsingenieuren der QA abgenommen (Staff Independence).'
    });
  }

  deliverables.push({
    name: 'Master AI Inventory Eintrag & SOP Change Control',
    tier: 'Tier 1 (Governance)',
    requirements: 'Eintragung im verbindlichen KI-Inventar zur Vermeidung von Schatten-KI. Festlegung statistischer Drift-Schwellenwerte (PSI > 0.2).'
  });

  const summary = verdict === 'REJECT'
    ? `Die aktuelle Konfiguration enthält fundamentale Verstöße gegen den Draft EU GMP Annex 22 (siehe Red Flags unten). Ein System mit dynamischem Weiterlernen oder ohne menschliche Freigabeinstanz ist im GxP-Betrieb nicht zulassungsfähig. Vor der Validierungsplanung müssen Architektur und Betriebsmodus zwingend angepasst werden.`
    : (verdict === 'CONDITIONAL'
      ? `Das Projekt ist grundsätzlich qualifizierungsfähig, unterliegt jedoch als Generative-KI-System strengen Auflagen. Es darf ausschließlich als "Drafting Assistant" unter RAG-Architektur agieren. Eine autonome Dokumentenübernahme ist ausgeschlossen.`
      : `Das geplante System erfüllt die architektonischen Kernvorgaben von Annex 22 (statisches Modell, Human-in-the-Loop, definierte Systemgrenzen). Das Qualifizierungsteam kann die Validierungsplanung auf Basis des Metric Quad und unabhängiger Hold-out-Sets initiieren.`);

  return {
    verdict,
    score,
    penalties,
    summary,
    redFlags,
    deliverables,
    testingRequirements,
    auditQuestions
  };
}
