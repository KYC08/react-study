import { useLocation, useNavigate } from 'react-router-dom';
import { StyledTable, StyledTd, StyledTh } from '../../../common/styled/StyledTable';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { NoticeModal } from '../NoticeModal/NoticeModal';
import { Portal } from '../../../common/portal/Portal';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { INotice, INoticeListResponse } from '../../../../models/INotice';
import { postNoticeApi } from '../../../../api/postNoticeApi';
import { Notice } from '../../../../api/api';
import { PageNavigate } from '../../../common/pageNavigation/PageNavigate';
import { NoticeContext } from '../../../../api/provider/NoticeProvider';

export const NoticeMain = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [noticeList, setNoticeList] = useState<INotice[]>();
  const [listCount, setListCount] = useState<number>(0);
  const [modal, setModal] = useRecoilState<boolean>(modalState); // recoil에 저장된 state
  const [index, setIndex] = useState<number>();
  const [cPage, setCPage] = useState<number>();
  const { searchKeyWord } = useContext(NoticeContext);

  // useEffect(() => {
  //   searchNoticeList();
  // }, [search]);

  useEffect(() => {
    console.log(searchKeyWord);
    searchNoticeList();
  }, [searchKeyWord]);

  const searchNoticeList = async (currentPage?: number) => {
    currentPage = currentPage || 1;
    // const searchParam = new URLSearchParams(search);
    // searchParam.append('currentPage', currentPage.toString());
    // searchParam.append('pageSize', '5');

    const searchParam = { ...searchKeyWord, currentPage: currentPage.toString(), pageSize: '5' };

    const searchList = await postNoticeApi<INoticeListResponse>(Notice.getListBody, searchParam);
    if (searchList) {
      setNoticeList(searchList.notice);
      setListCount(searchList.noticeCnt);
      setCPage(currentPage);
    }
  };

  // const searchNoticeList = async (currentPage?: number) => {
  //   currentPage = currentPage || 1;
  //   const searchParam = new URLSearchParams(search);
  //   searchParam.append('currentPage', currentPage.toString());
  //   searchParam.append('pageSize', '5');

  //   const searchList = await postNoticeApi<INoticeListResponse>(Notice.getList, searchParam);
  //   if (searchList) {
  //     setNoticeList(searchList.notice);
  //     setListCount(searchList.noticeCnt);
  //     setCPage(currentPage);
  //   }

  const handlerModal = (index: number) => {
    setModal(!modal);
    setIndex(index);
  };

  const onPostSuccess = () => {
    setModal(!modal);
    searchNoticeList();
  };

  const handlerDynamicRouter = (noticeIdx: number) => {
    navigate(noticeIdx);
  };

  return (
    <>
      총 갯수 : {listCount} 현재 페이지 : {cPage}
      <StyledTable>
        <thead>
          <tr>
            <StyledTh size={5}>번호</StyledTh>
            <StyledTh size={50}>제목</StyledTh>
            <StyledTh size={10}>작성자</StyledTh>
            <StyledTh size={20}>등록일</StyledTh>
          </tr>
        </thead>
        <tbody>
          {noticeList?.length > 0 ? (
            noticeList?.map((notice) => {
              return (
                // <tr key={notice.noticeIdx} onClick={() => handlerModal(notice.noticeIdx)}>
                <tr
                  key={notice.noticeIdx}
                  onClick={() => {
                    navigate(`${notice.noticeIdx}`, { state: { title: notice.title } });
                  }}
                >
                  <StyledTd>{notice.noticeIdx}</StyledTd>
                  <StyledTd>{notice.title}</StyledTd>
                  <StyledTd>{notice.author}</StyledTd>
                  <StyledTd>{notice.createdDate}</StyledTd>
                </tr>
              );
            })
          ) : (
            <tr>
              <StyledTd colSpan={3}>데이터가 없습니다.</StyledTd>
            </tr>
          )}
        </tbody>
      </StyledTable>
      <PageNavigate
        totalItemsCount={listCount}
        onChange={searchNoticeList}
        activePage={cPage}
        itemsCountPerPage={5}
      ></PageNavigate>
      {modal && (
        <Portal>
          <NoticeModal onSuccess={onPostSuccess} noticeSeq={index} setNoticeSeq={setIndex} />
        </Portal>
      )}
    </>
  );
};
