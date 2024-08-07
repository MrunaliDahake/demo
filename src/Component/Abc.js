import React, { useState } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


function Abc() {
  const [editorData, setEditorData] = useState('');

  const handleEditorChange = (event, editor) => {
    const newData = editor.getData();
    setEditorData(newData);
  };
  return (
    <div>
    <h1>Mrunu</h1>
    <CKEditor
      editor={ClassicEditor}
      data={editorData}
      onChange={handleEditorChange}
    />
  </div>
  )
}

export default Abc;