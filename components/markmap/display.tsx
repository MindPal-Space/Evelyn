"use client"

import React, { useRef, useEffect, type LegacyRef } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';

const transformer = new Transformer();

export default function MarkmapDisplay ({ markdownContent } : { markdownContent: string }) {
  // Ref for SVG element
  const refSvg = useRef<SVGSVGElement>();
  // Ref for markmap object
  const refMm = useRef<Markmap>();
  // Ref for toolbar wrapper

  useEffect(() => {
    // Create markmap and save to refMm
    const mm = Markmap.create(refSvg.current as SVGSVGElement);
    refMm.current = mm;
    return () => {
      // Clean up when the component unmounts
      if (refMm.current) {
        refMm.current.destroy();
        refMm.current = undefined;
      }
    };
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    // Update data for markmap once value is changed
    const mm = refMm.current;
    if (mm) {
      const { root } = transformer.transform(markdownContent);
      mm.setData(root);
      void mm.fit();
    }
  }, [markdownContent]);
  
  return (
    <React.Fragment>
      <section className='w-full h-full relative'>
        <svg className="flex-1 w-full h-full" ref={refSvg as LegacyRef<SVGSVGElement> | undefined} />
      </section>
    </React.Fragment>
  );
}
