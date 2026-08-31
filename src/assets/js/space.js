/**
 * Sumora 交互脚本 (GSAP)
 * - 入场动画
 * - 滚动显现
 * - 鼠标视差
 */

(function () {
  "use strict";

  const THEME_KEY = "sumora-theme";

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  function setTheme(theme) {
    const root = document.documentElement;
    // 切换瞬间禁用页面过渡：避免几十个元素同时做 0.3~0.6s 过渡导致掉帧，下一帧自动恢复
    root.classList.add("theme-switching");
    root.setAttribute("data-theme", theme);
    requestAnimationFrame(() => root.classList.remove("theme-switching"));
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // 忽略隐私模式下的存储异常
    }
  }

  function toggleTheme() {
    setTheme(getCurrentTheme() === "dark" ? "light" : "dark");
  }

  function initThemeToggle() {
    const title = document.querySelector(".hero-title");
    if (!title) return;
    title.style.cursor = "pointer";
    title.title = "点击切换主题";
    title.addEventListener("click", toggleTheme);
  }

  // ── 入场动画 ──
  function initEntrance() {
    const hero = document.querySelector(".hero-content");
    if (!hero) return;

    const subtitle = document.querySelector(".hero-subtitle");
    const actions = document.querySelector(".hero-actions");

    if (!prefersReducedMotion()) {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.from(hero, { opacity: 0, duration: 0.4 });

      if (subtitle) {
        tl.from(subtitle, { opacity: 0, y: 18, duration: 0.6, ease: "power2.out", clearProps: "all" }, "-=0.35");
      }

      if (actions) {
        tl.from(actions, { opacity: 0, y: 14, duration: 0.55, ease: "power2.out", clearProps: "all" }, "-=0.25");
      }
    }
  }

  // ── 滚动显现 (ScrollTrigger) ──
  function initScrollReveal() {
    const selectors = [".section-head", ".site-list-item"];
    const elements = document.querySelectorAll(selectors.join(","));
    if (!elements.length) return;

    if (prefersReducedMotion()) {
      elements.forEach((el) => el.style.opacity = "1");
      return;
    }

    elements.forEach((el, index) => {
      gsap.fromTo(el,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          delay: index * 0.06,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }

  // ── 轨道呼吸动画 (GSAP) ──
  // 直接作用于居中的 .orbit-system（≤900px）而非全屏容器，
  // 合成层尺寸大幅缩小；且离屏时暂停，回到视口再恢复，视觉效果不变。
  function initOrbitAnimation() {
    const svg = document.querySelector(".orbit-system");
    if (!svg) return;
    if (prefersReducedMotion()) return;

    const tween = gsap.to(svg, {
      scale: 1.03,
      rotation: 2,
      duration: 16,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // hero 不可见时暂停呼吸动画，可见时恢复（离屏零开销）
    ScrollTrigger.create({
      trigger: svg,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => tween.play(),
      onLeave: () => tween.pause(),
      onEnterBack: () => tween.play(),
      onLeaveBack: () => tween.pause(),
    });
  }

  // ── 域名申请邮件 ──
  // 静态站点无后端，输入用途后拼接 mailto 链接打开本地邮件客户端
  function initDomainApply() {
    const input = document.getElementById("applyReason");
    const btn = document.getElementById("applyBtn");
    if (!input || !btn) return;

    function send() {
      const reason = input.value.trim();
      const subject = encodeURIComponent("二级域名申请");
      const body = encodeURIComponent(
        reason ? `我想申请一个二级域名，用途如下：\n${reason}` : "我想申请一个二级域名。"
      );
      window.location.href = `mailto:hi@sumora.cn?subject=${subject}&body=${body}`;
    }

    btn.addEventListener("click", send);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") send();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();

    // GSAP 动画
    initEntrance();
    initScrollReveal();
    initOrbitAnimation();

    initDomainApply();
  });
})();
