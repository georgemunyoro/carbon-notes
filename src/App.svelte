<script>
  import Nav from "./components/Nav.svelte";
  import AddNoteBox from "./components/AddNoteBox.svelte";
  import SettingsModal from "./components/SettingsModal.svelte";
  import {
    ToastNotification,
    ClickableTile,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { user, notes, notifications } from "./store";
  import { writeNote } from "./firebase";
  import NoteEditor from "./components/NoteEditor.svelte";

  let showAddNoteBox = false;
  let listView = false;
  let showSettings = false;

  let currentView = "notes";

  const onClickAddNote = () => {
    showAddNoteBox = !showAddNoteBox;
  };

  const openSettings = () => showSettings = true;
  const closeSettings = () => showSettings = false;

  const handleAddedNote = ({ title, contents }) => {
    writeNote({
      title,
      contents,
      owner: $user.uid,
    });
  }

  const toggleListView = () => {
    listView = !listView;
  }

  onMount(() => {
  });

  const onClickTrash = () => currentView = "trash";
  const onClickNotes = () => currentView = "notes";
  const onClickArchive = () => currentView = "archive";
</script>


<div>
  <Nav {currentView} {onClickTrash} {onClickNotes} {onClickArchive} {onClickAddNote} onClickListView={toggleListView} onClickSettings={openSettings} />
  <AddNoteBox onSaveNote={handleAddedNote} open={showAddNoteBox} />
  <SettingsModal open={showSettings} onClose={closeSettings} />
  <div>
    <div class="notes-list">
      {#each $notes as note}
        {#if currentView === "notes" && note.inTrash === false && note.inArchive === false}
          <ClickableTile style={`margin: 0.5rem; flex-grow: 1; ${!listView && "width: 250px;"}`}>
            <NoteEditor {note} readOnly={true} />
          </ClickableTile>
        {/if}
        {#if currentView === "archive" && note.inTrash === false && note.inArchive === true}
          <ClickableTile style={`margin: 0.5rem; flex-grow: 1; ${!listView && "width: 250px;"}`}>
            <NoteEditor {note} readOnly={true} />
          </ClickableTile>
        {/if}
        {#if currentView === "trash" && note.inTrash === true && note.inArchive === false}
          <ClickableTile style={`margin: 0.5rem; flex-grow: 1; ${!listView && "width: 250px;"}`}>
            <NoteEditor {note} readOnly={true} />
          </ClickableTile>
        {/if}
      {/each}
    </div>
  </div>

  {#each $notifications as notification}
    <ToastNotification
      hideCloseButton
      kind={notification.type}
      title={notification.title}
      subtitle={notification.subtitle}
      caption={new Date().toLocaleString()}
    />
  {/each}
</div>

<style>
  .notes-list {
    padding-top: 4rem;
    margin: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
  }
</style>
