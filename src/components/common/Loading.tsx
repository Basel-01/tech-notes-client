type LoadingProps = {
  size?: string;
  margin?: string;
  color?: string;
};

const Loading: React.FC<LoadingProps> = ({
  size = "75px",
  margin = "30px 15px",
  color = "#fff",
}) => {
  return (
    <div className="spinner-container">
      <div
        className="spinner"
        style={{ width: size, height: size, margin, borderLeftColor: color }}
      ></div>
    </div>
  );
};

export default Loading;
