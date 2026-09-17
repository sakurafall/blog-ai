// 这个组件的作用很简单：统一页面宽度。

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-4xl px-6 ${className}`}>
      {children}
    </div>
  );
}