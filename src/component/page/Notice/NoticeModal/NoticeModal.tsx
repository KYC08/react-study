import { FC, useEffect, useRef, useState } from "react";
import { NoticeModalStyled } from "./styled";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import axios, { AxiosResponse } from "axios";
import { IDetailResponse, INoticeDetail, IPostResponse } from "../../../../models/INotice";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { Notice } from "../../../../api/api";

interface INoticeModalProps {
  onSuccess:() => void;
  noticeSeq: number;
  setNoticeSeq: (noticeSeq:number) => void;
}

export const NoticeModal: FC<INoticeModalProps> = ({ onSuccess, noticeSeq, setNoticeSeq }) => {
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [noticeDetail, setNoticeDetail] = useState<INoticeDetail>();
  const title = useRef<HTMLInputElement>();
  const context = useRef<HTMLInputElement>();

  useEffect(() => {
    noticeSeq && searchDetail();
    
    return () => {
      noticeSeq && setNoticeSeq(undefined);
    };
  }, []);


  const searchDetail = async () => {
    const detail = await postNoticeApi<IDetailResponse>(Notice.getDetail , {noticeSeq});

    if(detail){
      setNoticeDetail(detail.detail);
    }
  };

  const handlerModal = () => {
    setModal(!modal);
  };

  const handlerSave = () => {
    const param = {
      title: title.current.value,
      context: context.current.value,
      loginId: userInfo.loginId,
    };
    axios.post('/board/noticeSaveBody.do', param).then((res: AxiosResponse<IPostResponse>) => {
      res.data.result === 'success' && onSuccess();
    })
  };

  const handlerUpdate = () => {
    const param = {
      title: title.current.value,
      context: context.current.value,
      noticeSeq,
    };
    axios.post('/board/noticeUpdateBody.do', param).then((res: AxiosResponse<IPostResponse>) => {
      res.data.result === 'success' && onSuccess();
    })
  };

  const handlerDelete = () => {
    axios.post('/board/noticeDeleteBody.do', {noticeSeq}).then((res: AxiosResponse<IPostResponse>) => {
      res.data.result === 'success' && onSuccess();
    })
  };

  return (
    <NoticeModalStyled>
      <div className="container">
        <label>
          제목 :<input type="text" ref={title} defaultValue={noticeDetail?.title}></input>
        </label>
        <label>
          내용 : <input type="text" ref={context} defaultValue={noticeDetail?.content}></input>
        </label>
        파일 :
        <input type="file" id="fileInput" style={{ display: "none" }}></input>
        <label className="img-label" htmlFor="fileInput">
          파일 첨부하기
        </label>
        <div>
          <div>
            <label>미리보기</label>
            <img src="" />
          </div>
        </div>
        <div className={"button-container"}>
          <button onClick={noticeSeq ? handlerUpdate : handlerSave}>{noticeSeq ? '수정' : '등록'}</button>
          {noticeSeq && <button onClick={handlerDelete} >삭제</button>}
          <button onClick={handlerModal}>나가기</button>
        </div>
      </div>
    </NoticeModalStyled>
  );
};
