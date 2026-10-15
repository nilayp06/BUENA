import Preloader from '@/components/chrome/Preloader';
import Nav from '@/components/chrome/Nav';
import ScrollProgress from '@/components/chrome/ScrollProgress';
import Grain from '@/components/atmos/Grain';
import BottleStage from '@/components/product/BottleStage';

import Act01Arrival from '@/components/acts/Act01Arrival';
import Act02Idea from '@/components/acts/Act02Idea';
import Act03Origin from '@/components/acts/Act03Origin';
import Act04Product from '@/components/acts/Act04Product';
import Act05Why from '@/components/acts/Act05Why';
import Act06Experience from '@/components/acts/Act06Experience';
import Act07Details from '@/components/acts/Act07Details';
import Act08Final from '@/components/acts/Act08Final';
import Act09Find from '@/components/acts/Act09Find';

/**
 * The page composes the nine acts and nothing else. All choreography lives
 * in the acts themselves; the product lives in BottleStage, which spans
 * every one of them.
 */
export default function Page() {
  return (
    <>
      <Preloader />
      <Nav />
      <ScrollProgress />
      <BottleStage />

      <main id="main">
        <Act01Arrival />
        <Act02Idea />
        <Act03Origin />
        <Act04Product />
        <Act05Why />
        <Act06Experience />
        <Act07Details />
        <Act08Final />
        <Act09Find />
      </main>

      <Grain />
    </>
  );
}
