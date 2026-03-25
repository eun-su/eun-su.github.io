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
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentPosRef = useRef<StagePoses>([
    { x: 0, y: 0, scale: 1 },
    { x: 0, y: 0, scale: 1 },
    { x: 0, y: 0, scale: 1 },
  ]);

  const targetPosRef = useRef<StagePoses>([
    { x: 0, y: 0, scale: 1 },
    { x: 0, y: 0, scale: 1 },
    { x: 0, y: 0, scale: 1 },
  ]);

  const stagePosesRef = useRef<StagePoses[]>([]);

  useLayoutEffect(() => {
    const requiredRefs = [
      introRef.current,
      section2Ref.current,
      section3Ref.current,
      section4Ref.current,
      section5Ref.current,
      transition12Ref.current,
      transition23Ref.current,
      transition34Ref.current,
      transition45Ref.current,
    ];

    if (requiredRefs.some((ref) => !ref)) return;
    if (wrapperRefs.current.some((ref, index) => index < 3 && !ref)) return;
    if (innerRefs.current.some((ref, index) => index < 3 && !ref)) return;

    const ctx = gsap.context(() => {
      const wrappers = wrapperRefs.current.slice(0, 3) as HTMLDivElement[];
      const inners = innerRefs.current.slice(0, 3) as HTMLDivElement[];

      const cloneStage = (poses: StagePoses): StagePoses =>
        poses.map((pose) => ({ ...pose })) as StagePoses;

      const createStagePoses = (): StagePoses[] => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // 섹션 1
        const stage1: StagePoses = [
          { x: vw * 0.84, y: vh * 0.16, scale: 1.04 }, // orb1 우상단
          { x: vw * 0.18, y: vh * 0.78, scale: 0.96 }, // orb2 좌하단
          { x: vw * 0.58, y: vh * 0.68, scale: 1.08 }, // orb3 중앙하단
        ];

        // 섹션 2
        const stage2: StagePoses = [
          { x: vw * 0.16, y: vh * 0.46, scale: 1.08 }, // orb1 좌중앙
          { x: vw * 0.84, y: vh * 0.26, scale: 0.98 }, // orb2 우상단
          { x: vw * 0.46, y: vh * 0.84, scale: 1.02 }, // orb3 하단중앙
        ];

        // 섹션 3
        const stage3: StagePoses = [
          { x: vw * 0.28, y: vh * 0.18, scale: 1.0 },  // orb1 좌상단
          { x: vw * 0.78, y: vh * 0.62, scale: 1.04 }, // orb2 우중하
          { x: vw * 0.1, y: vh * 0.66, scale: 1.1 },   // orb3 좌하
        ];

        // 섹션 4
        const stage4: StagePoses = [
          { x: vw * 0.88, y: vh * 0.2, scale: 1.02 },  // orb1 우상단
          { x: vw * 0.18, y: vh * 0.34, scale: 1.08 }, // orb2 좌상중
          { x: vw * 0.68, y: vh * 0.82, scale: 0.96 }, // orb3 우하
        ];

        // 섹션 5
        const stage5: StagePoses = [
          { x: vw * 0.24, y: vh * 0.2, scale: 1.04 },
          { x: vw * 0.78, y: vh * 0.34, scale: 0.98 },
          { x: vw * 0.52, y: vh * 0.72, scale: 1.1 },
        ];

        return [stage1, stage2, stage3, stage4, stage5];
      };

      const applyTargetStage = (stageIndex: number) => {
        const poses = stagePosesRef.current[stageIndex];
        if (!poses) return;
        targetPosRef.current = cloneStage(poses);
      };

      const applyInterpolatedStage = (
        fromIndex: number,
        toIndex: number,
        progress: number
      ) => {
        const from = stagePosesRef.current[fromIndex];
        const to = stagePosesRef.current[toIndex];
        if (!from || !to) return;

        targetPosRef.current = from.map((pose, index) => ({
          x: gsap.utils.interpolate(pose.x, to[index].x, progress),
          y: gsap.utils.interpolate(pose.y, to[index].y, progress),
          scale: gsap.utils.interpolate(pose.scale, to[index].scale, progress),
        })) as StagePoses;
      };

      const build = () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.id?.toString().startsWith("intro-blur-")) {
            trigger.kill();
          }
        });

        stagePosesRef.current = createStagePoses();

        currentPosRef.current = cloneStage(stagePosesRef.current[0]);
        targetPosRef.current = cloneStage(stagePosesRef.current[0]);

        wrappers.forEach((wrapper, index) => {
          const pose = currentPosRef.current[index];
          gsap.set(wrapper, {
            x: pose.x,
            y: pose.y,
            scale: pose.scale,
            xPercent: -50,
            yPercent: -50,
            force3D: true,
          });
        });

        ScrollTrigger.create({
          id: "intro-blur-stage-1",
          trigger: introRef.current!,
          start: "top center",
          end: "bottom center",
          onEnter: () => applyTargetStage(0),
          onEnterBack: () => applyTargetStage(0),
        });

        ScrollTrigger.create({
          id: "intro-blur-stage-2",
          trigger: section2Ref.current!,
          start: "top center",
          end: "bottom center",
          onEnter: () => applyTargetStage(1),
          onEnterBack: () => applyTargetStage(1),
        });

        ScrollTrigger.create({
          id: "intro-blur-stage-3",
          trigger: section3Ref.current!,
          start: "top center",
          end: "bottom center",
          onEnter: () => applyTargetStage(2),
          onEnterBack: () => applyTargetStage(2),
        });

        ScrollTrigger.create({
          id: "intro-blur-stage-4",
          trigger: section4Ref.current!,
          start: "top center",
          end: "bottom center",
          onEnter: () => applyTargetStage(3),
          onEnterBack: () => applyTargetStage(3),
        });

        ScrollTrigger.create({
          id: "intro-blur-stage-5",
          trigger: section5Ref.current!,
          start: "top center",
          end: "bottom center",
          onEnter: () => applyTargetStage(4),
          onEnterBack: () => applyTargetStage(4),
        });

        ScrollTrigger.create({
          id: "intro-blur-transition-12",
          trigger: transition12Ref.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => applyInterpolatedStage(0, 1, self.progress),
        });

        ScrollTrigger.create({
          id: "intro-blur-transition-23",
          trigger: transition23Ref.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => applyInterpolatedStage(1, 2, self.progress),
        });

        ScrollTrigger.create({
          id: "intro-blur-transition-34",
          trigger: transition34Ref.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => applyInterpolatedStage(2, 3, self.progress),
        });

        ScrollTrigger.create({
          id: "intro-blur-transition-45",
          trigger: transition45Ref.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => applyInterpolatedStage(3, 4, self.progress),
        });

        ScrollTrigger.refresh();
      };

      const ticker = () => {
        wrappers.forEach((wrapper, index) => {
          const current = currentPosRef.current[index];
          const target = targetPosRef.current[index];

          current.x += (target.x - current.x) * 0.072;
          current.y += (target.y - current.y) * 0.072;
          current.scale += (target.scale - current.scale) * 0.072;

          gsap.set(wrapper, {
            x: current.x,
            y: current.y,
            scale: current.scale,
            xPercent: -50,
            yPercent: -50,
            force3D: true,
          });
        });
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

      build();
      window.addEventListener("resize", build);
      gsap.ticker.add(ticker);

      return () => {
        window.removeEventListener("resize", build);
        gsap.ticker.remove(ticker);
        floatTl1.kill();
        floatTl2.kill();
        floatTl3.kill();

        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.id?.toString().startsWith("intro-blur-")) {
            trigger.kill();
          }
        });
      };
    });

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
    <div className={styles.overlay} aria-hidden="true">
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