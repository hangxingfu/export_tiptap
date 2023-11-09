import "./styles.scss";

import { useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import {
  writeDocx,
  DocxSerializer,
  defaultNodes,
  defaultMarks
} from "prosemirror-docx";
import { saveAs } from "file-saver";

const nodeSerializer = {
  ...defaultNodes,
  hardBreak: defaultNodes.hard_break,
  codeBlock: defaultNodes.code_block,
  orderedList: defaultNodes.ordered_list,
  listItem: defaultNodes.list_item,
  bulletList: defaultNodes.bullet_list,
  horizontalRule: defaultNodes.horizontal_rule,
  image(state, node) {
    // No image
    state.renderInline(node);
    state.closeBlock(node);
  }
};

const docxSerializer = new DocxSerializer(nodeSerializer, defaultMarks);

export default function App() {
  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: "Editor"
      }
    },
    content: `
      <h1>Welcome to your fresh Tiptap Code Sandbox</h1>
      <p>You can create a demo for your issue inside of this sandbox and share it with us.</p>
    `
  });

  const write = useCallback(async () => {
    const opts = {
      getImageBuffer(src) {
        return Buffer.from("Real buffer here");
      }
    };
    console.log('opts: ', opts)

    const wordDocument = docxSerializer.serialize(editor.state.doc, opts);

    await writeDocx(wordDocument, (buffer) => {
      console.log(buffer)
      saveAs(new Blob([buffer]), "example.docx");
    });
  }, [editor?.state.doc]);

  return (
    <div className="App">
      <button onClick={write}>Export to Word</button>
      <EditorContent editor={editor} />
    </div>
  );
}
