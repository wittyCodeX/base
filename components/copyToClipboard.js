// @flow
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { CiMedicalClipboard, CiCircleCheck } from 'react-icons/ci';

const CopyTo = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <CopyToClipboard text={data} onCopy={() => handleCopy()}>
      <span className="ml-1">
        {!copied ? <CiMedicalClipboard /> : <CiCircleCheck />}
      </span>
    </CopyToClipboard>
  );
};

export default CopyTo;
