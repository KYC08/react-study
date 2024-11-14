export interface INotice {
    noticeIdx: number;
    title: string;
    author: string;
    createdDate: string;
  }

export interface IPostResponse {
    result: string;
  }
  
export interface INoticeDetail extends INotice {
    content: string;
    fileExt: string | null;
    fileName: string | null;
    fileSize: number;
    logicalPath: string | null;
    phsycalPath: string | null;
  }
  
export interface IDetailResponse {
    detail: INoticeDetail;
  }

export interface INoticeListResponse {
  noticeCnt: number;
  notice: INotice[];
}

