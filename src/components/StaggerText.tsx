import { motion } from 'framer-motion';

interface StaggerTextProps {
  text: string;
  className?: string;
  delay?: number;
  /** Duration per character */
  charDuration?: number;
  /** Stagger delay between chars */
  stagger?: number;
}

export default function StaggerText({
  text,
  className = '',
  delay = 0,
  charDuration = 0.5,
  stagger = 0.03,
}: StaggerTextProps) {
  const words = text.split(' ');

  return (
    <motion.span
      className={`inline ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split('').map((char, ci) => (
            <motion.span
              key={`${wi}-${ci}`}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: {
                    duration: charDuration,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}
