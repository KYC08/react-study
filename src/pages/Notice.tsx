import { useState } from 'react';
import { ContentBox } from '../component/common/ContentBox/ContentBox';
import { NoticeMain } from '../component/page/Notice/NoticeMain/NoticeMain';
import { NoticeSearch } from '../component/page/Notice/NoticeSearch/NoticeSearch';

export const Notice = () => {
    const [modal, setModal] = useState(false)
    return (
        <>
            <ContentBox>공지사항</ContentBox>
            <NoticeSearch />
            <NoticeMain />
        </>
    );
};
