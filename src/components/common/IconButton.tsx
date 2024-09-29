import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type IconButtonProps = {
  icon: IconDefinition;
  title: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  color?: string;
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  title,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  color,
}) => {
  return (
    <button
      type={type}
      className={`icon-button ${className}`}
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{ color: color || undefined }}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

export default IconButton;
