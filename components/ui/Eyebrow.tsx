import styles from './Eyebrow.module.css';

/** Small tracked-out label with a leading rule. Echoes the bottle's own
 *  "PURE. REFRESHING. NATURAL." lockup. */
export default function Eyebrow({
  children,
  className = '',
  rule = true,
}: {
  children: React.ReactNode;
  className?: string;
  rule?: boolean;
}) {
  return (
    <p className={`eyebrow ${styles.row} ${className}`}>
      {rule && <span className={styles.rule} aria-hidden="true" />}
      <span>{children}</span>
    </p>
  );
}
