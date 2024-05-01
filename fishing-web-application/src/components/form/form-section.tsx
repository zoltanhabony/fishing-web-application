interface FormSectionsProps {
  size?: "secondary" | "third";
  title: string;
  description: string;
}

export const FormSections = ({
  title,
  description,
  size,
}: FormSectionsProps) => {
  return (
    <div className="space-y-1 pb-1">
      {size === "secondary" ? (
        <h2 className="text-md font-medium">{title}</h2>
      ) : size === "third" ? (
        <h2 className="text-sm font-medium">{title}</h2>
      ) : (
        <h2 className="text-lg font-medium">{title}</h2>
      )}
      {size === "secondary" ? (
        <p className="text-small text-default-400">{description}</p>
      ) : size === "third" ? (
        <p className="text-xs text-default-400">{description}</p>
      ) : (
        <p className="text-small text-default-400">{description}</p>
      )}
    </div>
  );
};
