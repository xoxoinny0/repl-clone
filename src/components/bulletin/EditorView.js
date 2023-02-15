import React, { memo } from 'react';
import { CKEditor } from 'ckeditor4-react';
import styled from 'styled-components';

const PostingContests = styled.div`
    width: 800px;
    margin: auto;
    margin-bottom: 50px;
`

const Editor = memo(props => {
    return (
        <PostingContests>
            <CKEditor
                initData={props.postContent}
                onInstanceReady={ () => {
                    // console.log( 'Editor is ready!' ); // 인스턴스 생성 완료되면 할 내용
                } }
                type='classic' // classic / inline 인데 classic이 나을듯
                name='postingContentEditor' // 에디터 인스턴스에 대한 유일 식별자
                readOnly={true} // true로 하면 읽기 전용
                config={ {
                    extraPlugins: 'autogrow',
                    autoGrow_minHeight: 200, // 자동 높이 조절 최소 값
                    autoGrow_maxHeight: 600, // " 최대값
                    autoGrow_bottomSpace: 50, // 아래에서부터 본문 띄울 영역
                    //  bodyId: 'contents_id', // 본문 내용 가르킬 Id

                    toolbarGroups: [],

                    removePlugins: 'resize', 
                } }
            />
        </PostingContests>
    );
});

export default Editor;