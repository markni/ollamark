import React from "react";

const Glow: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      <style>
        {`
          .edge {
            position: absolute;
            /* A dynamic gradient with smooth color shifts */
            background: linear-gradient(270deg, #6dbaf8, #a57ff4, #ed8e4c, #6dbaf8);
            background-size: 600% 600%;
            /* Extra brightness and blur for a stronger glow */
            filter: blur(8px) brightness(150%);
            /* Blend mode can help the glow sit naturally on top of content */
            mix-blend-mode: screen;
            /* Two animations:
               - moveGradient shifts the background gradient
               - flow applies a gentle jitter & scale to mimic water movement */
            animation: moveGradient 4s linear infinite, flow 6s ease-in-out infinite;
          }
          
          /* Pseudo-element for an inner glow that appears to shine inward */
          .edge::after {
            content: '';
            position: absolute;
            inset: 0;
            background: inherit;
            filter: blur(15px);
            transform: scale(0.95);
          }

          /* Define each edge with a bit more width for visibility */
          .edge.top {
            top: 0;
            left: 0;
            width: 100%;
            height: 10px;
            /* Reversing animation direction to vary the motion */
            animation-direction: reverse;
          }
          .edge.bottom {
            bottom: 0;
            left: 0;
            width: 100%;
            height: 10px;
          }
          .edge.left {
            top: 0;
            left: 0;
            width: 10px;
            height: 100%;
            animation-direction: reverse;
          }
          .edge.right {
            top: 0;
            right: 0;
            width: 10px;
            height: 100%;
          }
          
          /* Animate the gradient background shift */
          @keyframes moveGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          /* Create a water-like flow by gently moving and scaling the edges */
          @keyframes flow {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(3px, 3px) scale(1.05); }
            50% { transform: translate(6px, 3px) scale(1.25); }
            75% { transform: translate(3px, 6px) scale(1.05); }
          }
        `}
      </style>

      {/* The four glowing edges */}
      <div className="edge top" />
      <div className="edge bottom" />
      <div className="edge left" />
      <div className="edge right" />
    </div>
  );
};

export default Glow;
