"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

// 커스텀 페이지 이동 이벤트에서 받을 데이터 타입
type NavigateEventDetail = {
  href: string;
};

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * overlayRef
   * - 전체 전환 레이어의 최상위 컨테이너
   * - fixed / inset-0 로 화면 전체를 덮음
   * - 페이지 전환이 시작되면 보이고, 끝나면 숨김
   */
  const overlayRef = useRef<HTMLDivElement | null>(null);

  /**
   * maskGlowRef
   * - 블러 처리된 보조 원 레이어
   * - 원 경계가 너무 딱딱하지 않게 만드는 역할
   */
  const maskGlowRef = useRef<HTMLDivElement | null>(null);

  /**
   * maskRef
   * - 선명한 메인 원 레이어
   * - 실제로 화면을 덮는 주된 원형 마스크
   */
  const maskRef = useRef<HTMLDivElement | null>(null);

  /**
   * uiRef
   * - 로딩 UI 전체 묶음
   * - label + 숫자 + 바 를 감싸는 레이어
   */
  const uiRef = useRef<HTMLDivElement | null>(null);

  /**
   * labelRef
   * - "Entering Design Works", "Returning Home" 같은 문구가 들어가는 영역
   */
  const labelRef = useRef<HTMLParagraphElement | null>(null);

  /**
   * valueRef
   * - 0% ~ 100% 카운터 숫자 영역
   */
  const valueRef = useRef<HTMLParagraphElement | null>(null);

  /**
   * barTrackRef
   * - 로딩 바의 바깥 트랙(회색/반투명 줄)
   */
  const barTrackRef = useRef<HTMLDivElement | null>(null);

  /**
   * barRef
   * - 실제로 채워지는 흰색 로딩 바
   */
  const barRef = useRef<HTMLDivElement | null>(null);

  /**
   * isBusyRef
   * - 현재 전환 애니메이션이 진행 중인지 여부
   * - true면 또 다른 페이지 전환을 막음
   */
  const isBusyRef = useRef(false);

  /**
   * waitingForRouteRef
   * - 페이지 이동(router.push) 후,
   *   새 페이지에 들어와서 "닫히는 애니메이션"을 재생해야 할 때 true
   */
  const waitingForRouteRef = useRef(false);

  /**
   * hasIntroPlayedRef
   * - 첫 진입 로딩 애니메이션을 이미 재생했는지 여부
   * - 첫 페이지 진입과 이후 페이지 이동을 구분하는 데 사용
   */
  const hasIntroPlayedRef = useRef(false);

  /**
   * pendingHrefRef
   * - 현재 이동하려는 목적지 href를 잠시 저장
   * - 지금은 디버그/확장용 성격
   */
  const pendingHrefRef = useRef<string | null>(null);

  /**
   * 숫자 카운터 텍스트 변경 함수
   * 예: 37 -> "37%"
   */
  const setCounterText = (value: number) => {
    if (!valueRef.current) return;
    valueRef.current.textContent = `${Math.round(value)}%`;
  };

  /**
   * 로딩 문구 변경 함수
   * 예: "Entering Design Works"
   */
  const setLabelText = (text: string) => {
    if (!labelRef.current) return;
    labelRef.current.textContent = text;
  };

  /**
   * 전환 문구 결정 함수
   *
   * 규칙:
   * - 첫 진입이면 "Entering Eunsu World"
   * - /design 이면 "Entering Design Works"
   * - /study 이면 "Entering Study Notes"
   * - /issues 이면 "Entering Issue Board"
   * - /favorites 이면 "Entering Favorites"
   * - 다른 페이지에서 / 로 돌아오면 "Returning Home"
   */
  const getTransitionLabel = (
    href: string,
    currentPath?: string,
    isInitial?: boolean
  ) => {
    if (isInitial) {
      return "Entering Eunsu World";
    }

    const cleanHref = href.split("#")[0] || "/";
    const current = currentPath || "/";

    if (cleanHref === "/" && current !== "/") {
      return "Returning Home";
    }

    switch (cleanHref) {
      case "/":
        return "Entering Eunsu World";
      case "/design":
        return "Entering Design Works";
      case "/study":
        return "Entering Study Notes";
      case "/issues":
        return "Entering Issue Board";
      case "/favorites":
        return "Entering Favorites";
      default:
        return "Loading";
    }
  };

  /**
   * 원형 기준점 관련 함수
   *
   * 열릴 때는 좌측 상단(0% 0%) 기준으로 확장
   * 닫힐 때는 우측 하단(100% 100%) 기준으로 수축
   */
  const getClosedCircleFromTopLeft = () => "circle(0px at 0% 0%)";
  const getOpenCircleFromTopLeft = () => "circle(150vmax at 0% 0%)";

  const getClosedCircleFromBottomRight = () => "circle(0px at 100% 100%)";
  const getOpenCircleFromBottomRight = () => "circle(150vmax at 100% 100%)";

  /**
   * 로딩 UI 초기화
   * - 문구 세팅
   * - 숫자 0%로
   * - 텍스트/바 opacity, position, blur 초기값 복원
   * - 로딩 바 scaleX = 0으로 리셋
   */
  const resetLoaderUI = (labelText: string) => {
    if (
      !uiRef.current ||
      !labelRef.current ||
      !valueRef.current ||
      !barTrackRef.current ||
      !barRef.current
    ) {
      return;
    }

    setLabelText(labelText);
    setCounterText(0);

    gsap.set(uiRef.current, { opacity: 1 });

    gsap.set([labelRef.current, valueRef.current], {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      filter: "blur(0px)",
    });

    gsap.set(barTrackRef.current, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    });

    gsap.set(barRef.current, {
      scaleX: 0,
      transformOrigin: "left center",
      opacity: 1,
    });
  };

  /**
   * 좌측 상단 기준 작은 원 상태로 리셋
   * - 페이지 이동 시작 전 준비 상태
   */
  const setMasksTopLeftClosed = () => {
    if (!maskRef.current || !maskGlowRef.current) return;

    gsap.set([maskRef.current, maskGlowRef.current], {
      clipPath: getClosedCircleFromTopLeft(),
      opacity: 1,
    });
  };

  /**
   * 좌측 상단 기준 큰 원 상태
   * - 첫 진입 시 화면이 이미 꽉 덮인 상태로 시작할 때 사용
   */
  const setMasksTopLeftOpen = () => {
    if (!maskRef.current || !maskGlowRef.current) return;

    gsap.set([maskRef.current, maskGlowRef.current], {
      clipPath: getOpenCircleFromTopLeft(),
      opacity: 1,
    });
  };

  /**
   * 우측 하단 기준 큰 원 상태
   * - 새 페이지에 들어온 뒤, 우하단 기준으로 닫힐 준비 상태
   */
  const setMasksBottomRightOpen = () => {
    if (!maskRef.current || !maskGlowRef.current) return;

    gsap.set([maskRef.current, maskGlowRef.current], {
      clipPath: getOpenCircleFromBottomRight(),
      opacity: 1,
    });
  };

  /**
   * 전환 종료(닫히는) 애니메이션
   *
   * 흐름:
   * 1. 100% 후 잠깐 유지
   * 2. 텍스트 흔들림
   * 3. 텍스트/숫자 사라짐
   * 4. 로딩 바 사라짐
   * 5. 우측 하단을 기준으로 원형 마스크 수축
   * 6. overlay 숨김
   */
  const finishReveal = () => {
    if (
      !overlayRef.current ||
      !maskRef.current ||
      !maskGlowRef.current ||
      !labelRef.current ||
      !valueRef.current ||
      !barTrackRef.current
    ) {
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlayRef.current, {
          opacity: 0,
          pointerEvents: "none",
        });

        gsap.set([maskRef.current, maskGlowRef.current], {
          opacity: 1,
        });

        // 다음 페이지 전환을 위해 다시 초기 상태로 되돌림
        setMasksTopLeftClosed();

        isBusyRef.current = false;
        pendingHrefRef.current = null;
      },
    });

    tl
      /**
       * [처음 로딩 완료 후 잠깐 멈추는 시간]
       * 숫자 100% 된 뒤 텍스트가 바로 흔들리지 않게 약간의 여유를 줌
       *
       * 이 값을 줄이면:
       * - 100% 뒤 더 빨리 다음 동작으로 넘어감
       */
      .to({}, { duration: 0.08 })

      /**
       * 텍스트 살짝 흔들림
       * - 너무 기계적이지 않게, 살짝 떨리며 사라질 준비
       */
      .to([labelRef.current, valueRef.current], {
        keyframes: [
          { x: -4, rotate: -2, duration: 0.03 },
          { x: 4, rotate: 2, duration: 0.03 },
          { x: -2, rotate: -1, duration: 0.03 },
          { x: 0, rotate: 0, duration: 0.02 },
        ],
        ease: "power2.out",
      })

      /**
       * 텍스트/숫자 사라짐
       */
      .to(
        [labelRef.current, valueRef.current],
        {
          y: -18,
          opacity: 0,
          filter: "blur(2px)",
          duration: 0.2,
          ease: "power2.out",
          stagger: 0.02,
        },
        "+=0.01"
      )

      /**
       * 로딩 바(트랙 포함)도 같이 사라짐
       */
      .to(
        barTrackRef.current,
        {
          y: -12,
          opacity: 0,
          filter: "blur(2px)",
          duration: 0.18,
          ease: "power2.out",
        },
        "<+0.01"
      )

      /**
       * [텍스트/바가 사라진 뒤 원 닫히기 전 텀]
       * 이 값이 크면 "정적이 흐른다" 느낌이 납니다.
       * 이 값을 줄이면 원이 더 빨리 닫히기 시작합니다.
       */
      .to({}, { duration: 0.04 })

      /**
       * 우측 하단 기준으로 원형 수축
       *
       * duration:
       * - 수축에 걸리는 총 시간
       * ease:
       * - 처음은 느리고, 뒤로 갈수록 빨라지도록 함
       *
       * 이 값이 너무 크면 "멈춘 것처럼" 느껴질 수 있습니다.
       */
      .to(
        maskRef.current,
        {
          clipPath: getClosedCircleFromBottomRight(),
          duration: 1.22,
          ease: "power4.in",
        },
        0
      )
      .to(
        maskGlowRef.current,
        {
          clipPath: getClosedCircleFromBottomRight(),
          duration: 1.22,
          ease: "power4.in",
        },
        "<"
      )

      .set(overlayRef.current, {
        opacity: 0,
        pointerEvents: "none",
      });
  };

  /**
   * 첫 진입(초기 로딩) 애니메이션
   *
   * 흐름:
   * 1. overlay 보이기
   * 2. 화면이 이미 꽉 찬 상태에서 시작
   * 3. 문구/숫자/바 등장
   * 4. 숫자 0 -> 100
   * 5. finishReveal() 호출
   */
  const playIntro = () => {
    if (
      !overlayRef.current ||
      !maskRef.current ||
      !maskGlowRef.current ||
      !labelRef.current ||
      !valueRef.current ||
      !barTrackRef.current ||
      !barRef.current
    ) {
      return;
    }

    isBusyRef.current = true;

    gsap.set(overlayRef.current, {
      opacity: 1,
      pointerEvents: "auto",
    });

    setMasksTopLeftOpen();
    resetLoaderUI(getTransitionLabel("/", "/", true));

    const counter = { value: 0 };

    gsap.timeline({
      onComplete: () => {
        hasIntroPlayedRef.current = true;
        finishReveal();
      },
    })
      /**
       * [처음 진입 시 배경만 먼저 보이는 시간]
       * 화면이 단색으로 덮인 상태가 얼마나 유지될지 결정
       *
       * 이 값을 줄이면 첫 진입이 더 빨라짐
       * 이 값을 늘리면 "배경이 먼저 딱 보이는" 시간이 길어짐
       */
      .to({}, { duration: 0.2 })

      /**
       * 로딩 UI 등장
       */
      .fromTo(
        [labelRef.current, valueRef.current, barTrackRef.current],
        {
          opacity: 0,
          y: 14,
          filter: "blur(3px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.36,
          ease: "power2.out",
          stagger: 0.04,
        }
      )

      /**
       * [UI가 뜬 뒤 로딩 시작 전 잠깐]
       */
      .to({}, { duration: 0.1 })

      /**
       * 숫자 0 -> 100
       *
       * === 처음 로딩 시간의 핵심 ===
       * 여기 duration을 바꾸면 첫 진입 카운트 시간이 바뀝니다.
       */
      .to(
        counter,
        {
          value: 100,
          duration: 1.15,
          ease: "none",
          onUpdate: () => {
            setCounterText(counter.value);
          },
        },
        0.52
      )

      /**
       * 로딩 바 채워지는 시간
       * 숫자와 같은 시간으로 맞춰둔 상태
       */
      .to(
        barRef.current,
        {
          scaleX: 1,
          duration: 1.15,
          ease: "none",
        },
        0.52
      );
  };

  /**
   * 페이지 이동 전 "덮는" 애니메이션
   *
   * 흐름:
   * 1. 좌측 상단 작은 원에서 시작
   * 2. 좌측 상단 기준으로 원이 커지며 화면 덮음
   * 3. 문구/숫자/바 등장
   * 4. 0 -> 100
   * 5. router.push(href)
   * 6. 새 페이지에서 finishReveal() 실행
   */
  const playCoverAndNavigate = (href: string) => {
    if (
      !overlayRef.current ||
      !maskRef.current ||
      !maskGlowRef.current ||
      !labelRef.current ||
      !valueRef.current ||
      !barTrackRef.current ||
      !barRef.current
    ) {
      return;
    }

    if (isBusyRef.current) return;

    isBusyRef.current = true;
    pendingHrefRef.current = href;

    gsap.set(overlayRef.current, {
      opacity: 1,
      pointerEvents: "auto",
    });

    setMasksTopLeftClosed();
    resetLoaderUI(getTransitionLabel(href, pathname));

    const counter = { value: 0 };

    gsap.timeline({
      onComplete: () => {
        waitingForRouteRef.current = true;
        router.push(href);
      },
    })
      /**
       * 좌측 상단 기준 원 확장
       *
       * 이 duration / ease 값을 바꾸면
       * 페이지 이동 시 원이 화면을 덮는 속도가 바뀝니다.
       */
      .to(
        maskRef.current,
        {
          clipPath: getOpenCircleFromTopLeft(),
          duration: 1.02,
          ease: "power4.in",
        },
        0
      )
      .to(
        maskGlowRef.current,
        {
          clipPath: getOpenCircleFromTopLeft(),
          duration: 1.02,
          ease: "power4.in",
        },
        "<"
      )

      /**
       * 덮은 뒤 짧은 텀
       */
      .to({}, { duration: 0.1 })

      /**
       * 로딩 UI 등장
       */
      .fromTo(
        [labelRef.current, valueRef.current, barTrackRef.current],
        {
          opacity: 0,
          y: 14,
          filter: "blur(3px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.34,
          ease: "power2.out",
          stagger: 0.04,
        }
      )

      /**
       * UI 등장 후 짧은 텀
       */
      .to({}, { duration: 0.1 })

      /**
       * 숫자 카운트
       *
       * 페이지 이동 시 로딩 시간의 핵심
       * 여기 duration을 바꾸면 페이지 이동 로딩 시간이 바뀝니다.
       */
      .to(
        counter,
        {
          value: 100,
          duration: 1.08,
          ease: "none",
          onUpdate: () => {
            setCounterText(counter.value);
          },
        },
        ">-0.02"
      )

      /**
       * 로딩 바 채우기
       */
      .to(
        barRef.current,
        {
          scaleX: 1,
          duration: 1.08,
          ease: "none",
        },
        "<"
      );
  };

  /**
   * 앱 첫 마운트 시: 첫 진입 로딩 실행
   */
  useEffect(() => {
    playIntro();
  }, []);

  /**
   * "app:navigate" 커스텀 이벤트 감지
   * - Header에서 좌측 메뉴를 누르면 이 이벤트를 발사
   * - 여기서 실제 덮는 애니메이션 + router.push 진행
   */
  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<NavigateEventDetail>;
      const href = customEvent.detail?.href;

      if (!href) return;
      if (href === pathname) return;

      playCoverAndNavigate(href);
    };

    window.addEventListener("app:navigate", handleNavigate as EventListener);

    return () => {
      window.removeEventListener("app:navigate", handleNavigate as EventListener);
    };
  }, [pathname]);

  /**
   * 라우팅 완료 후 새 페이지에서 닫히는 애니메이션 시작
   */
  useEffect(() => {
    if (!hasIntroPlayedRef.current) return;

    if (waitingForRouteRef.current) {
      waitingForRouteRef.current = false;

      // 새 페이지에서는 우하단 기준으로 닫힐 준비
      setMasksBottomRightOpen();

      /**
       * [페이지 이동 후 닫히기 시작하기 전 텀]
       * 이 값을 늘리면 새 페이지에서 덮인 상태가 더 오래 유지됩니다.
       */
      window.setTimeout(() => {
        finishReveal();
      }, 140);
    }
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-[9999] opacity-0"
      aria-hidden="true"
    >
      {/* 블러된 보조 원 */}
      <div
        ref={maskGlowRef}
        className="absolute inset-0 bg-neutral-950"
        style={{
          clipPath: "circle(0px at 0% 0%)",
          filter: "blur(16px)",
          opacity: 0.65,
        }}
      />

      {/* 선명한 메인 원 */}
      <div
        ref={maskRef}
        className="absolute inset-0 bg-neutral-950"
        style={{
          clipPath: "circle(0px at 0% 0%)",
          opacity: 1,
        }}
      />

      {/* 로딩 UI */}
      <div
        ref={uiRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-white"
      >
        <p
          ref={labelRef}
          className="mb-3 text-xs uppercase tracking-[0.24em] opacity-70 md:text-sm"
        >
          Entering Eunsu World
        </p>

        <p
          ref={valueRef}
          className="text-[34px] leading-none tracking-[-0.05em] md:text-[72px]"
        >
          0%
        </p>

        <div
          ref={barTrackRef}
          className="mt-5 h-px w-[180px] overflow-hidden bg-white/20 md:w-[280px]"
        >
          <div
            ref={barRef}
            className="h-full w-full origin-left scale-x-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}