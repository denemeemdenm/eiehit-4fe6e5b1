import { motion } from 'framer-motion';

interface StaggerHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  gradient?: 'cyan' | 'red' | 'animated';
  delay?: number;
}

const gradientStyles = {
  cyan: {
    background: 'linear-gradient(90deg, #64FFFF, #36D6D6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  red: {
    background: 'linear-gradient(90deg, #FF4B00, #CC3A00)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  animated: {
    background: 'linear-gradient(90deg, #FF4B00, #FF4B00, #64FFFF, #64FFFF)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'gradientShift 4s ease infinite',
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0,
    },
  },
};

const charVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function StaggerHeading({ text, as: Tag = 'h2', className = '', gradient = 'cyan', delay = 0 }: StaggerHeadingProps) {
  const words = text.split(' ');

  return (
    <div className="overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.03, delayChildren: delay } },
        }}
      >
        <Tag
          className={className}
          style={gradientStyles[gradient]}
        >
          {words.map((word, wi) => (
            <span key={wi} className="inline-block whitespace-nowrap">
              {word.split('').map((char, ci) => (
                <motion.span key={ci} className="inline-block" variants={charVariants}>
                  {char}
                </motion.span>
              ))}
              {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
            </span>
          ))}
        </Tag>
      </motion.div>
      {/* Gradient underline */}
      <motion.div
        className="h-[2px] rounded-full mt-2"
        style={{
          background: gradient === 'red'
            ? 'linear-gradient(90deg, #FF4B00, #CC3A00)'
            : 'linear-gradient(90deg, #64FFFF, #36D6D6)',
        }}
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: delay + 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  );
}
