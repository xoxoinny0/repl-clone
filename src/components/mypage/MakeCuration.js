import React, { memo } from 'react';
import PageInputBox from './PageInputBox';

const MakeCuration = memo(() => {
    return (
        <div>
            <PageInputBox className='curBox' width={'300px'} height={'50px'}>
                <input type="text" placeholder='ex) 강북러의 강북 맛집 탐험' maxLength={15}></input>
            </PageInputBox>
        </div>
    );
});

export default MakeCuration;