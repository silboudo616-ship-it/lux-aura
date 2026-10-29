/* Titre "sillage" : le texte laisse derrière lui des copies en contour qui s'effacent,
   comme la trace d'un parfum. Les copies sont décoratives (aria-hidden). */
export default function Sillage({ as: Tag = 'h2', children, className = '', echoes = 3, ...rest }) {
  return (
    <Tag className={`sillage ${className}`} {...rest}>
      <span className="sillage__text">{children}</span>
      {Array.from({ length: echoes }, (_, i) => (
        <span key={i} className="sillage__echo" aria-hidden="true" style={{ '--i': i + 1 }}>
          {children}
        </span>
      ))}
    </Tag>
  );
}
