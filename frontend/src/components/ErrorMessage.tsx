type Props = {
  message: string;
};

export function ErrorMessage({ message }: Props) {
  return <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message}</div>;
}
