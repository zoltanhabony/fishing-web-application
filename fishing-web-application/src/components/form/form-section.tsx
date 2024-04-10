interface FormSectionsProps {
    title: string
    description: string
}

export const FormSections = ( {title, description}: FormSectionsProps ) => {
  return (
    <div className="space-y-1 pt-3 pb-3">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-small text-default-400">
        {description}
      </p>
    </div>
  );
};
