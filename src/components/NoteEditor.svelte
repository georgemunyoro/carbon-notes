<script>
  export let onSubmit;
  export let readOnly = false;
  export let note = {
    title: "",
    contents: null
  }

  import {trashNote, archiveNote} from "../firebase";

  import {onMount} from "svelte";

  import Quill from "quill";
  import "quill/dist/quill.snow.css";

  import {Button, TextInput, OverflowMenu, OverflowMenuItem} from "carbon-components-svelte";

  let editor;
  let quill;

  let noteTitle = note.title;

  const submitNote = () => {
    onSubmit({
      title: noteTitle,
      contents: quill.getContents(),
    });
  };

  onMount(async () => {
    const toolbarConfig = [
      [{ 'font': [] }, { 'size': [] }],
      [ 'bold', 'italic', 'underline', 'strike' ],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'super' }, { 'script': 'sub' }],
      [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block' ],
      [{ 'list': 'check' }, { 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
      [ 'direction', { 'align': [] }],
      [ 'link', 'image', 'video', 'formula' ],
      [ 'clean' ]
    ]

    if (readOnly) quill = new Quill(editor);
    else {
      quill = new Quill(editor, {
        modules: {
          toolbar: toolbarConfig
        },
        placeholder: "...",
        theme: "snow",
        value: ""
      });
    }

    if (note.contents) quill.setContents(JSON.parse(note.contents));
    if (readOnly) quill.disable();
  });
</script>

<div class="editor-wrapper">
  <div style="display: flex;">
    {#if readOnly}
      <OverflowMenu>
        <OverflowMenuItem text="Edit note" />
        <OverflowMenuItem on:click={() => archiveNote(note.id)} text="Archive note" />
        <OverflowMenuItem on:click={() => trashNote(note.id)} danger text="Move to Trash" />
      </OverflowMenu>
    {/if}
    <TextInput disabled={readOnly} style="background: none;" bind:value={noteTitle} />
  </div>
  <div bind:this={editor} />
  {#if !readOnly}
    <Button on:click={submitNote}>Save</Button>
  {/if}

</div>

