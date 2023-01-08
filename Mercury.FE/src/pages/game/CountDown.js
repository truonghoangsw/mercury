import React, {useEffect, useState} from 'react';

function CountDown() {
  const [isShow, setIsShow] = useState(true);
  const [isHiding, setIsHiding] = useState(false);
  const [count, setCount] = useState(5);

  useEffect(() => {
    const handler = () => {
      setIsHiding(true);
    };
    const timer = setTimeout(handler, 4000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isHiding) {
      return;
    }
    const handler = () => {
      setIsShow(false);
    };
    const timer = setTimeout(handler, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [isHiding]);

  useEffect(() => {
    const handler = () => {
      setCount(prev => prev - 1);
    };
    const id = setInterval(handler, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  if (!isShow) {
    return null;
  }

  return (
    <div className="count-down">
      {count}
    </div>
  );
}

export default React.memo(CountDown);
