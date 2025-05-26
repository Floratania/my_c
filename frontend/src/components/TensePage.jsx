// src/components/TensePage.jsx
import { useParams } from 'react-router-dom';

import PresentSimple from './tenses/PresentSimple';
import PresentContinuous from './tenses/PresentContinuous';
import PresentPerfect from './tenses/PresentPerfect';
import PresentPerfectContinuous from './tenses/PresentPerfectContinuous';
import PastSimple from './tenses/PastSimple';
import PastContinuous from './tenses/PastContinuous';
import PastPerfect from './tenses/PastPerfect';
import PastPerfectContinuous from './tenses/PastPerfectContinuous';
import FutureSimple from './tenses/FutureSimple';
import FutureContinuous from './tenses/FutureContinuous';
import FuturePerfect from './tenses/FuturePerfect';
import FuturePerfectContinuous from './tenses/FuturePerfectContinuous';

export default function TensePage() {
  const { tenseName } = useParams();
  const decoded = decodeURIComponent(tenseName);

  const TENSE_MAP = {
    'Present Simple': <PresentSimple />,
    'Present Continuous': <PresentContinuous />,
    'Present Perfect': <PresentPerfect />,
    'Present Perfect Continuous': <PresentPerfectContinuous />,
    'Past Simple': <PastSimple />,
    'Past Continuous': <PastContinuous />,
    'Past Perfect': <PastPerfect />,
    'Past Perfect Continuous': <PastPerfectContinuous />,
    'Future Simple': <FutureSimple />,
    'Future Continuous': <FutureContinuous />,
    'Future Perfect': <FuturePerfect />,
    'Future Perfect Continuous': <FuturePerfectContinuous />,
  };

  return TENSE_MAP[decoded] || <p>⛔ Час "{decoded}" не знайдено</p>;
}
