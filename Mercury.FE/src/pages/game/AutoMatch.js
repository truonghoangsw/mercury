import React, {useCallback, useEffect, useState} from 'react';
import ws from '../../common/ws';

function AutoMatch({userId}) {
  const [isAutoMapping, setIsAutoMapping] = useState(false);

  const handleAutoMatch = useCallback(() => {
    setIsAutoMapping(true);
    ws.invoke('AutoMatch', {
      userId,
    });
  }, [userId]);

  useEffect(() => {
    const handler = (data) => {
      console.log(data);
    };
    ws.on('AutoMatch', handler);
    return () => {
      ws.off('AutoMatch');
    };
  }, []);

  return (
    <button
      onClick={handleAutoMatch}
      disabled={isAutoMapping}>
      {!isAutoMapping ? 'Auto Match' : 'Matching...'}
    </button>
  );
}

export default React.memo(AutoMatch);
