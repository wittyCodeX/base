import React, { useRef, useState, useEffect } from 'react';
import { FaRegWindowClose } from 'react-icons/fa';
import moment from 'moment';
import { db } from '@/config/firebase';
import { onValue, ref, query, orderByChild, equalTo } from 'firebase/database';

const TransactionHistoryModal = ({ address }) => {
  const closeRef = useRef();
  const [history, setMyHistory] = useState();

  useEffect(() => {
    if (address) {
      const dbQuery = query(
        ref(db, 'histories'),
        orderByChild('address'),
        equalTo(address)
      );
      onValue(dbQuery, (snapshot) => {
        const returned = snapshot.val();

        if (snapshot.exists() && returned) {
          const values = Object.values(returned);
          setMyHistory(values.sort((a, b) => a.reg_date - b.reg_date));
        }
      });
    }
    return () => {
      setMyHistory();
    };
  }, [address]);

  const convertCurrency = (labelValue) => {
    return Number(labelValue) >= 1.0e9
      ? (Number(labelValue) / 1.0e9).toFixed(2) + 'B'
      : Number(labelValue) >= 1.0e6
      ? (Number(labelValue) / 1.0e6).toFixed(2) + 'M'
      : Number(labelValue) >= 1.0e3
      ? (Number(labelValue) / 1.0e3).toFixed(2) + 'K'
      : Number(labelValue);
  };

  return (
    <div
      data-te-modal-dialog-ref
      className=" pointer-events-none relative flex min-h-[50vh] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-[150px] min-[576px]:max-w-[500px] "
    >
      <div className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] border-color bg-wrapper-color pointer-events-auto relative flex w-full flex-col rounded-3xl border-none bg-clip-padding text-current shadow-lg outline-none ">
        <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4">
          <h5
            className="text-xl font-medium leading-normal text-white"
            id="exampleModalLabel"
          >
            My Activities
          </h5>
          <button
            ref={closeRef}
            type="button"
            className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
            data-te-modal-dismiss
            aria-label="Close"
          >
            <FaRegWindowClose />
          </button>
        </div>
        <div className="mim-h-[400px] bg-color flex h-[400px] max-h-[400px] flex-col overflow-y-auto  rounded-3xl">
          <table
            className="w-full p-3 text-white"
            border="0"
            cellSpacing="0"
            cellPadding="0"
          >
            <thead>
              <tr className="p-2 text-xl">
                <th className="py-2">No</th>
                <th>From</th>
                <th>To</th>
                <th>XP</th>
                <th>Date</th>
              </tr>
            </thead>

            {history && history.length > 0 ? (
              <tbody className="w-full p-2 text-center">
                {history.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? 'bg-wrapper-color cursor-pointer gap-3 rounded p-2 '
                          : 'gap-3 p-2 '
                      }
                    >
                      <td className="p-2">{index + 1}</td>
                      <td>
                        <span className="text-green-500">
                          {item.sellAmount}
                        </span>
                        {'  '}
                        {` (${item.tokenFrom})`}
                      </td>
                      <td>
                        <span className="text-green-500">{item.buyAmount}</span>{' '}
                        {`  (${item.tokenTo})`}
                      </td>
                      <td className="text-green-500">
                        {' '}
                        {convertCurrency(item.newXP)}
                      </td>
                      <td> {moment(item.reg_date).format('yyyy-MM-DD')}</td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <tbody className=" w-full animate-pulse rounded-2xl p-2 text-center opacity-5">
                <tr className="bg-wrapper-color m-2  w-full animate-pulse rounded-2xl opacity-5">
                  <td colSpan={4} className="mx-2">
                    <div
                      role="status"
                      className="bg-wrapper-color m-2  w-full animate-pulse rounded-2xl opacity-5"
                    >
                      <div className="disabled-bg"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </td>
                </tr>
                <tr className="bg-wrapper-color m-2  w-full animate-pulse rounded-2xl opacity-5">
                  <td colSpan={4} className="mx-2">
                    <div
                      role="status"
                      className="bg-wrapper-color m-2  w-full animate-pulse rounded-2xl opacity-5"
                    >
                      <div className="disabled-bg"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </td>
                </tr>
                <tr className="bg-wrapper-color m-2  w-full animate-pulse rounded-2xl opacity-5">
                  <td colSpan={4} className="mx-2">
                    <div
                      role="status"
                      className="bg-wrapper-color m-2  w-full animate-pulse rounded-2xl opacity-5"
                    >
                      <div className="disabled-bg"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </td>
                </tr>
                <tr className="bg-wrapper-color m-2  w-full animate-pulse rounded-2xl opacity-5">
                  <td colSpan={4} className="mx-2">
                    <div
                      role="status"
                      className="bg-wrapper-color m-2  w-full animate-pulse rounded-2xl opacity-5"
                    >
                      <div className="disabled-bg"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryModal;
