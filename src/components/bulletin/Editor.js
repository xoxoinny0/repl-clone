import React, { memo, useCallback } from 'react';
import { CKEditor } from 'ckeditor4-react';
import styled from 'styled-components';

const PostingContests = styled.div`
    width: 800px;
    margin: auto;
    margin-bottom: 50px;
`;

const editorStyle = {
    border: 'none',
};

const Editor = memo(props => {
    const onContentInput = useCallback(e => {
        const data = e.editor.getData();
        props.setContent(data);
    }, []);

    return (
        <PostingContests>
            <CKEditor
                initData="여기에 내용을 입력하세요."
                onInstanceReady={ () => {
                    // console.log( 'Editor is ready!' ); // 인스턴스 생성 완료되면 할 내용
                    props.setContent("<p>여기에 내용을 입력하세요.</p>");
                } }
                type='classic' // classic / inline 인데 classic이 나을듯
                name='postingContentEditor' // 에디터 인스턴스에 대한 유일 식별자
                readOnly={false} // true로 하면 읽기 전용
                config={ {
                    extraPlugins: 'autogrow',
                    autoGrow_minHeight: 200, // 자동 높이 조절 최소 값
                    autoGrow_maxHeight: 600, // " 최대값
                    autoGrow_bottomSpace: 50, // 아래에서부터 본문 띄울 영역
                    bodyId: 'contents_id', // 본문 내용 가르킬 Id
                    toolbarGroups: [
                        { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
                        { name: 'styles', groups: [ 'styles' ] },
                        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
                        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
                        { name: 'insert', groups: [ 'insert' ] },
                        { name: 'forms', groups: [ 'forms' ] },
                        { name: 'others', groups: [ 'others' ] },
                        { name: 'links', groups: [ 'links' ] },
                        { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
                        { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
                        { name: 'tools', groups: [ 'tools' ] },
                        { name: 'colors', groups: [ 'colors' ] },
                        { name: 'about', groups: [ 'about' ] }
                    ],
                    removeButtons: 'Subscript,Superscript,Cut,Copy,Paste,PasteText,PasteFromWord,Scayt,Link,Unlink,Anchor,SpecialChar,Maximize,Source,RemoveFormat,Blockquote,About,Styles',

                    removePlugins: 'resize',
                } }
                style={editorStyle}
                onChange={onContentInput}
            />
        </PostingContests>
    );
});

export default Editor;