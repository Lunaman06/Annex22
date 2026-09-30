// tests/evaluation_scenarios.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  SCENARIO_BENCHMARKS,
  calculateLiveScore,
  extractParametersHeuristically,
  buildCoAuditorPrompt,
  parseCoAuditorResponse,
  generateExpertBlueprint
} from '../src/simulator-engine.js';

describe('22Annex.ai Ground Truth & Regression Test Suite', () => {

  describe('Szenario 1: K.O. Dynamisches Selbstlernen [Draft §1]', () => {
    const scn = SCENARIO_BENCHMARKS.find(s => s.id === 'SCN-01-DYNAMIC-LEARNING');

    it('extrahiert korrekte Parameter aus dem Prompt (Heuristik)', () => {
      const extracted = extractParametersHeuristically(scn.prompt);
      assert.equal(extracted.learningType, 'dynamic', 'Muss als dynamisch erkannt werden');
      assert.equal(extracted.modelType, 'predictive_ml', 'Muss als predictive_ml erkannt werden');
      assert.equal(extracted.processArea, 'in_process', 'Muss als in_process erkannt werden');
    });

    it('berechnet Strafpunkte und erzeugt zwingende Red Flag', () => {
      const state = {
        projectName: 'Bioreaktor Optimizer',
        learningType: 'dynamic',
        processArea: 'in_process',
        modelType: 'predictive_ml',
        autonomyLevel: 'hitl'
      };
      const { score, penalties, flags } = calculateLiveScore(state);
      assert.equal(score, 65, 'Muss genau 35 Punkte Abzug erhalten (100 - 35 = 65)');
      assert.ok(penalties.some(p => p.citation === '[Draft §1]'), 'Muss Zitat [Draft §1] enthalten');
      assert.ok(flags.some(f => f.title.includes('Dynamisches Selbstlernen')), 'Muss Red Flag zu dynamischem Selbstlernen enthalten');
    });

    it('erzeugt Blueprint mit Status REJECT', () => {
      const state = {
        projectName: 'Bioreaktor Optimizer',
        learningType: 'dynamic',
        processArea: 'in_process',
        modelType: 'predictive_ml',
        autonomyLevel: 'hotl'
      };
      const bp = generateExpertBlueprint(state);
      assert.equal(bp.verdict, 'REJECT');
      assert.ok(bp.redFlags.some(f => f.reference.includes('Draft §1')));
      assert.ok(bp.summary.includes('fundamentale Verstöße'));
    });
  });

  describe('Szenario 2: K.O. Vollautonome Freigaben / HOOL [Draft §3, §9.2]', () => {
    const scn = SCENARIO_BENCHMARKS.find(s => s.id === 'SCN-02-HOOL-AUTONOMY');

    it('extrahiert HOOL-Autonomie und OOS-Prozessbereich', () => {
      const extracted = extractParametersHeuristically(scn.prompt);
      assert.equal(extracted.autonomyLevel, 'hool', 'Muss als HOOL erkannt werden');
      assert.equal(extracted.processArea, 'oos_investigation', 'Muss als oos_investigation erkannt werden');
    });

    it('zieht -30 Punkte ab und zitiert Art. 51 2001/83/EG', () => {
      const state = {
        projectName: 'Autonomous Deviation Agent',
        learningType: 'static',
        processArea: 'batch_release',
        modelType: 'predictive_ml',
        autonomyLevel: 'hool'
      };
      const { score, penalties, flags } = calculateLiveScore(state);
      assert.equal(score, 70, '100 - 30 = 70');
      assert.ok(flags.some(f => f.ref.includes('Art. 51 2001/83/EG')), 'Muss Art. 51 zitieren');
    });

    it('straft doppelte K.O.-Kriterien kumulativ ab', () => {
      const state = {
        learningType: 'dynamic', // -35
        autonomyLevel: 'hool',   // -30
        processArea: 'batch_release',
        modelType: 'predictive_ml'
      };
      const { score } = calculateLiveScore(state);
      assert.equal(score, 35, '100 - 35 - 30 = 35 Punkte');
    });
  });

  describe('Szenario 3: Optische Vial-Inspektion (Computer Vision) [Draft §6, §7]', () => {
    const scn = SCENARIO_BENCHMARKS.find(s => s.id === 'SCN-03-VISION-VIAL-INSPECTION');

    it('extrahiert Vision-Modell, statische Gewichte und HITL', () => {
      const extracted = extractParametersHeuristically(scn.prompt);
      assert.equal(extracted.modelType, 'vision_defect');
      assert.equal(extracted.learningType, 'static');
      assert.equal(extracted.autonomyLevel, 'hitl');
    });

    it('erzielt 100% Score ohne Strafpunkte', () => {
      const state = {
        projectName: 'AI-Vision Parenteralia',
        processArea: 'in_process',
        modelType: 'vision_defect',
        learningType: 'static',
        autonomyLevel: 'hitl',
        dataSource: 'internal_gxp'
      };
      const { score, penalties, flags } = calculateLiveScore(state);
      assert.equal(score, 100);
      assert.equal(penalties.length, 0);
      assert.equal(flags.length, 0);
    });

    it('generiert VALIDATION_READY Blueprint mit Metrik-Quad & Recall-Vorgaben', () => {
      const state = {
        projectName: 'AI-Vision Parenteralia',
        processArea: 'in_process',
        modelType: 'vision_defect',
        learningType: 'static',
        autonomyLevel: 'hitl',
        dataSource: 'internal_gxp'
      };
      const bp = generateExpertBlueprint(state);
      assert.equal(bp.verdict, 'VALIDATION_READY');
      assert.ok(bp.testingRequirements.some(t => t.metric.includes('Recall (Sensitivität) ≥ 99.5%')));
      assert.ok(bp.deliverables.some(d => d.name.includes('Unabhängiger Validierungsplan')));
    });
  });

  describe('Szenario 4: GenAI RAG Assistant [Draft §8]', () => {
    const scn = SCENARIO_BENCHMARKS.find(s => s.id === 'SCN-04-GENAI-RAG-ASSISTANT');

    it('extrahiert GenAI-RAG Modelltyp und OOS-Bereich', () => {
      const extracted = extractParametersHeuristically(scn.prompt);
      assert.equal(extracted.modelType, 'genai_rag');
      assert.equal(extracted.processArea, 'oos_investigation');
      assert.equal(extracted.autonomyLevel, 'hitl');
    });

    it('wendet Stochastik-Penalty (-10) an', () => {
      const state = {
        projectName: 'SOP RAG Bot',
        processArea: 'oos_investigation',
        modelType: 'genai_rag',
        learningType: 'static',
        autonomyLevel: 'hitl',
        dataSource: 'internal_gxp'
      };
      const { score, penalties } = calculateLiveScore(state);
      assert.equal(score, 90, '100 - 10 = 90');
      assert.ok(penalties.some(p => p.citation.includes('Draft §8')));
    });

    it('setzt Blueprint-Status auf CONDITIONAL und verlangt RAG-Triade', () => {
      const state = {
        projectName: 'SOP RAG Bot',
        processArea: 'oos_investigation',
        modelType: 'genai_rag',
        learningType: 'static',
        autonomyLevel: 'hitl',
        dataSource: 'internal_gxp'
      };
      const bp = generateExpertBlueprint(state);
      assert.equal(bp.verdict, 'CONDITIONAL');
      assert.ok(bp.testingRequirements.some(t => t.metric.includes('RAG Triad: Groundedness')));
      assert.ok(bp.deliverables.some(d => d.name.includes('RAG-First')));
    });
  });

  describe('Szenario 5 & Parser-Resilienz (Co-Auditor Feedback & JSON Schema)', () => {
    it('formatiert Co-Auditor Prompt mit Annex-22-Inspektoren-Persona', () => {
      const prompt = buildCoAuditorPrompt('Wir wollen eine KI einsetzen', { projectName: 'Test' });
      assert.ok(prompt.includes('Draft EU GMP Annex 22'));
      assert.ok(prompt.includes('EMA'));
      assert.ok(prompt.includes('extractedParameters'));
    });

    it('parst saubere JSON-Antworten vom LLM', () => {
      const mockJson = JSON.stringify({
        auditorReply: 'Ihr System erfordert strikte Frozen Weights nach [Draft §1].',
        extractedParameters: {
          projectName: 'Vial Inspector',
          processArea: 'in_process',
          modelType: 'vision_defect',
          learningType: 'static',
          autonomyLevel: 'hitl'
        },
        isVague: false
      });
      const parsed = parseCoAuditorResponse(mockJson);
      assert.equal(parsed.extractedParameters.modelType, 'vision_defect');
      assert.equal(parsed.extractedParameters.learningType, 'static');
      assert.ok(parsed.auditorReply.includes('[Draft §1]'));
    });

    it('parst mit Markdown-Codeblöcken ummantelte JSON-Antworten', () => {
      const fenced = '```json\n{\n  "auditorReply": "Achtung vor HOOL nach [Draft §3]!",\n  "extractedParameters": {\n    "autonomyLevel": "hool"\n  }\n}\n```';
      const parsed = parseCoAuditorResponse(fenced);
      assert.equal(parsed.extractedParameters.autonomyLevel, 'hool');
      assert.ok(parsed.auditorReply.includes('[Draft §3]'));
    });

    it('fällt bei ungültigem JSON sicher auf Heuristik zurück ohne abzustürzen', () => {
      const rawText = 'Wir nutzen Frozen Weights und Human-in-the-Loop bei der Kamerainspektion.';
      const parsed = parseCoAuditorResponse(rawText);
      assert.equal(parsed.extractedParameters.learningType, 'static');
      assert.equal(parsed.extractedParameters.autonomyLevel, 'hitl');
      assert.equal(parsed.extractedParameters.modelType, 'vision_defect');
    });
  });

});
