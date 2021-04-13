<script>
  export let open = false;
  export let onSaveNote = () => {};

  import NoteEditor from "./NoteEditor.svelte";
  import {
    ModalFooter,
    ComposedModal,
    TextArea,
    TextInput,
    Tile,
  } from "carbon-components-svelte";

  let noteTitle = "TITLE";
  let noteContents = "...";

  const closeAddNoteModal = () => {
    open = false;
  };
  
  const onClickSave = (note) => {
    onSaveNote({
      title: note.title,
      contents: JSON.stringify(note.contents)
    });
    closeAddNoteModal();
  }
</script>

<div>
  <ComposedModal {open} on:close={closeAddNoteModal} on:submit={onClickSave}>
    <Tile>
      <NoteEditor onSubmit={onClickSave} />
    </Tile>
  </ComposedModal>
</div>

<style>

</style>
