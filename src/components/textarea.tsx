type TextareaProps = {
  onChange: (value: string) => void;
  value: string;
};

const Textarea = ({
  onChange,
  value,
}: TextareaProps) => {
  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }
  return (
    <textarea rows={4} style={{ width: '100%'}} onChange={handleOnChange} value={value} />
  )
}

export default Textarea;
