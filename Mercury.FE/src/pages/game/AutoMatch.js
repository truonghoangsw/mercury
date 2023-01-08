import React, {useCallback, useEffect, useState} from 'react';
import ws from '../../common/ws';

function AutoMatch({userId, onStartGame}) {
  const [isAutoMapping, setIsAutoMapping] = useState(false);

  const handleAutoMatch = useCallback(() => {
    setIsAutoMapping(true);
    ws.invoke('AutoMatch', {
      userId,
    });
  }, [userId]);

  useEffect(() => {
    ws.on('AutoMatch', onStartGame);
    return () => {
      ws.off('AutoMatch');
    };
  }, [onStartGame]);

  return (
    <button
      onClick={handleAutoMatch}
      disabled={isAutoMapping}>
      {!isAutoMapping ? 'Auto Match' : 'Matching...'}
    </button>
  );
}

export default React.memo(AutoMatch);
