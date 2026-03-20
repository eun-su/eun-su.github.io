"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./FloatingBlurOverlay.module.scss";

gsap.registerPlugin(ScrollTrigger);

type SectionRef = React.RefObject<HTMLElement | null>;

type FloatingBlurOverlayProps = {
  introRef: SectionRef;
  section2Ref: SectionRef;
  section3Ref: SectionRef;
  section4Ref: SectionRef;
  section5Ref: SectionRef;
  transition12Ref: SectionRef;
  transition23Ref: SectionRef;
  transition34Ref: SectionRef;
  transition45Ref: SectionRef;
};

type OrbPose = {
  x: number;
  y: number;
  scale: number;
};

type StagePoses = [OrbPose, OrbPose, OrbPose];

export default function FloatingBlurOverlay({
  introRef,
  section2Ref,
  section3Ref,
  section4Ref,
  section5Ref,
  transition12Ref,
  transition23Ref,
  transition34Ref,
  transition45Ref,
}: FloatingBlurOverlayProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const refsReady =
      overlayRef.current &&
      introRef.current &&
      section2Ref.current &&
      section3Ref.current &&
      section4Ref.current &&
      section5Ref.current &&
      transition12Ref.current &&
      transition23Ref.current &&
      transition34Ref.current &&
      transition45Ref.current &&
      wrapperRefs.current[0] &&
      wrapperRefs.current[1] &&
      wrapperRefs.current[2] &&
      innerRefs.current[0] &&
      innerRefs.current[1] &&
      innerRefs.current[2];

    if (!refsReady) return;

    const ctx = gsap.context(() => {
      const wrappers = [
        wrapperRefs.current[0]!,
        wrapperRefs.current[1]!,
        wrapperRefs.current[2]!,
      ];

      const inners = [
        innerRefs.current[0]!,
        innerRefs.current[1]!,
        innerRefs.current[2]!,
      ];

      let xToFns: ((value: number) => gsap.core.Tween)[] = [];
      let yToFns: ((value: number) => gsap.core.Tween)[] = [];
      let scaleToFns: ((value: number) => gsap.core.Tween)[] = [];

      const createStagePoses = (): StagePoses[] => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const stage1: StagePoses = [
          { x: vw * 0.84, y: vh * 0.16, scale: 1.04 }, // orb1 우상단
          { x: vw * 0.18, y: vh * 0.78, scale: 0.96 }, // orb2 좌하단
          { x: vw * 0.58, y: vh * 0.68, scale: 1.08 }, // orb3 하단중앙
        ];

        const stage2: StagePoses = [
          { x: vw * 0.16, y: vh * 0.46, scale: 1.08 }, // orb1 좌중앙
          { x: vw * 0.84, y: vh * 0.26, scale: 0.98 }, // orb2 우상단
          { x: vw * 0.46, y: vh * 0.84, scale: 1.02 }, // orb3 하단중앙
        ];

        const stage3: StagePoses = [
          { x: vw * 0.28, y: vh * 0.18, scale: 1.0 },  // orb1 좌상단
          { x: vw * 0.78, y: vh * 0.62, scale: 1.04 }, // orb2 우중하
          { x: vw * 0.1, y: vh * 0.66, scale: 1.1 },   // orb3 좌하
        ];

        const stage4: StagePoses = [
          { x: vw * 0.88, y: vh * 0.2, scale: 1.02 },  // orb1 우상단
          { x: vw * 0.18, y: vh * 0.34, scale: 1.08 }, // orb2 좌상중
          { x: vw * 0.68, y: vh * 0.82, scale: 0.96 }, // orb3 우하
        ];

        const stage5: StagePoses = [
          { x: vw * 0.24, y: vh * 0.2, scale: 1.04 },
          { x: vw * 0.78, y: vh * 0.34, scale: 0.98 },
          { x: vw * 0.52, y: vh * 0.72, scale: 1.1 },
        ];

        return [stage1, stage2, stage3, stage4, stage5];
      };

      let stagePoses = createStagePoses();

      const setInitialPositions = () => {
        wrappers.forEach((wrapper, index) => {
          const pose = stagePoses[0][index];

          gsap.set(wrapper, {
            x: pose.x,
            y: pose.y,
            scale: pose.scale,
            xPercent: -50,
            yPercent: -50,
            force3D: true,
          });
        });
      };

      const createQuickSetters = () => {
        xToFns = wrappers.map((wrapper) =>
          gsap.quickTo(wrapper, "x", {
            duration: 0.7,
            ease: "power3.out",
          })
        );

        yToFns = wrappers.map((wrapper) =>
          gsap.quickTo(wrapper, "y", {
            duration: 0.7,
            ease: "power3.out",
          })
        );

        scaleToFns = wrappers.map((wrapper) =>
          gsap.quickTo(wrapper, "scale", {
            duration: 0.7,
            ease: "power3.out",
          })
        );
      };

      const moveToStage = (stageIndex: number) => {
        const poses = stagePoses[stageIndex];
        if (!poses) return;

        poses.forEach((pose, index) => {
          xToFns[index](pose.x);
          yToFns[index](pose.y);
          scaleToFns[index](pose.scale);
        });
      };

      const moveBetweenStages = (
        fromIndex: number,
        toIndex: number,
        progress: number
      ) => {
        const from = stagePoses[fromIndex];
        const to = stagePoses[toIndex];
        if (!from || !to) return;

        from.forEach((pose, index) => {
          const nextX = gsap.utils.interpolate(pose.x, to[index].x, progress);
          const nextY = gsap.utils.interpolate(pose.y, to[index].y, progress);
          const nextScale = gsap.utils.interpolate(
            pose.scale,
            to[index].scale,
            progress
          );

          xToFns[index](nextX);
          yToFns[index](nextY);
          scaleToFns[index](nextScale);
        });
      };

      const killBlurTriggers = () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.id?.toString().startsWith("intro-blur-")) {
            trigger.kill();
          }
        });
      };

      const buildTriggers = () => {
        killBlurTriggers();

        ScrollTrigger.create({
          id: "intro-blur-stage-1",
          trigger: introRef.current!,
          start: "top center",
          end: "bottom center",
          onEnter: () => moveToStage(0),
          onEnterBack: () => moveToStage(0),
        });

        ScrollTrigger.create({
          id: "intro-blur-stage-2",
          trigger: section2Ref.current!,
          start: "top center",
          end: "bottom center",
          onEnter: () => moveToStage(1),
          onEnterBack: () => moveToStage(1),
        });

        ScrollTrigger.create({
          id: "intro-blur-stage-3",
          trigger: section3Ref.current!,
          start: "top center",
          end: "bottom center",
          onEnter: () => moveToStage(2),
          onEnterBack: () => moveToStage(2),
        });

        ScrollTrigger.create({
          id: "intro-blur-stage-4",
          trigger: section4Ref.current!,
          start: "top center",
          end: "bottom center",
          onEnter: () => moveToStage(3),
          onEnterBack: () => moveToStage(3),
        });

        ScrollTrigger.create({
          id: "intro-blur-stage-5",
          trigger: section5Ref.current!,
          start: "top center",
          end: "bottom center",
          onEnter: () => moveToStage(4),
          onEnterBack: () => moveToStage(4),
        });

        ScrollTrigger.create({
          id: "intro-blur-transition-12",
          trigger: transition12Ref.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => moveBetweenStages(0, 1, self.progress),
        });

        ScrollTrigger.create({
          id: "intro-blur-transition-23",
          trigger: transition23Ref.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => moveBetweenStages(1, 2, self.progress),
        });

        ScrollTrigger.create({
          id: "intro-blur-transition-34",
          trigger: transition34Ref.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => moveBetweenStages(2, 3, self.progress),
        });

        ScrollTrigger.create({
          id: "intro-blur-transition-45",
          trigger: transition45Ref.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => moveBetweenStages(3, 4, self.progress),
        });

        ScrollTrigger.refresh();
      };

      const floatTl1 = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { ease: "sine.inOut" },
      });

      floatTl1
        .to(inners[0], {
          x: 10,
          y: -12,
          rotate: 2.5,
          duration: 4.8,
        })
        .to(inners[0], {
          x: -8,
          y: 9,
          rotate: -1.8,
          duration: 4.2,
        });

      const floatTl2 = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { ease: "sine.inOut" },
      });

      floatTl2
        .to(inners[1], {
          x: -7,
          y: -16,
          rotate: -2.2,
          duration: 5.6,
        })
        .to(inners[1], {
          x: 9,
          y: 11,
          rotate: 1.7,
          duration: 4.9,
        });

      const floatTl3 = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { ease: "sine.inOut" },
      });

      floatTl3
        .to(inners[2], {
          x: 8,
          y: -9,
          rotate: 1.4,
          duration: 4.2,
        })
        .to(inners[2], {
          x: -10,
          y: 13,
          rotate: -2.4,
          duration: 5.1,
        });

      const rebuild = () => {
        stagePoses = createStagePoses();
        setInitialPositions();
        createQuickSetters();
        moveToStage(0);
        buildTriggers();
      };

      rebuild();
      window.addEventListener("resize", rebuild);

      return () => {
        window.removeEventListener("resize", rebuild);
        floatTl1.kill();
        floatTl2.kill();
        floatTl3.kill();
        killBlurTriggers();
      };
    }, overlayRef);

    return () => ctx.revert();
  }, [
    introRef,
    section2Ref,
    section3Ref,
    section4Ref,
    section5Ref,
    transition12Ref,
    transition23Ref,
    transition34Ref,
    transition45Ref,
  ]);

  return (
    <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
      <div
        ref={(el) => {
          wrapperRefs.current[0] = el;
        }}
        className={styles.orbWrapper}
      >
        <div
          ref={(el) => {
            innerRefs.current[0] = el;
          }}
          className={`${styles.orb} ${styles.orbOne}`}
        />
      </div>

      <div
        ref={(el) => {
          wrapperRefs.current[1] = el;
        }}
        className={styles.orbWrapper}
      >
        <div
          ref={(el) => {
            innerRefs.current[1] = el;
          }}
          className={`${styles.orb} ${styles.orbTwo}`}
        />
      </div>

      <div
        ref={(el) => {
          wrapperRefs.current[2] = el;
        }}
        className={styles.orbWrapper}
      >
        <div
          ref={(el) => {
            innerRefs.current[2] = el;
          }}
          className={`${styles.orb} ${styles.orbThree}`}
        />
      </div>
    </div>
  );
}