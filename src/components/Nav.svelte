<script>
  export let onClickAddNote;
  export let onClickListView;
  export let onClickSettings;
  export let onClickArchive;
  export let onClickTrash;
  export let onClickNotes;
  export let currentView;

  import { Button } from "carbon-components-svelte";
  import Settings32 from "carbon-icons-svelte/lib/Settings32";
  import ListBoxes32 from "carbon-icons-svelte/lib/ListBoxes32";
  import Grid32 from "carbon-icons-svelte/lib/Grid32";
  import Add32 from "carbon-icons-svelte/lib/Add32";
  import UserAvatar32 from "carbon-icons-svelte/lib/UserAvatar32";
  import TrashCan32 from "carbon-icons-svelte/lib/TrashCan32";
  import Archive32 from "carbon-icons-svelte/lib/Archive32";
  import Notebook32 from "carbon-icons-svelte/lib/Notebook32";
  import Reminder32 from "carbon-icons-svelte/lib/Reminder32";

  import { user } from "../store";
  import { googleProvider, auth, writeUserData, listenForUserNoteUpdates } from "../firebase";
  
  let listView = false;

  $: isLoggedIn = Object.keys($user).length !== 0;

  $: isArchiveView = currentView === "archive";
  $: isNotesView = currentView === "notes";
  $: isTrashView = currentView === "trash";

  const onLoginButtonClick = () => {
    auth.signInWithPopup(googleProvider);
  };

  const onLogoutButtonClick = () => {
    auth.signOut();
  };

  auth.onAuthStateChanged((u) => {
    if (u) {
      user.set(u);
      writeUserData(u.uid, u.displayName, u.email, u.photoURL);
      listenForUserNoteUpdates()
    }
  });
</script>

<nav>
  <ul>
    {#if isLoggedIn}
      <li>
        <Button
          on:click={onLogoutButtonClick}
          kind="ghost"
          iconDescription={$user.displayName}
          icon={UserAvatar32}
        />
      </li>
    {:else}
      <li>
        <Button on:click={onLoginButtonClick} kind="ghost">Login</Button>
      </li>
    {/if}
    <li>
      <Button on:click={onClickSettings} iconDescription="Settings" kind="ghost" icon={Settings32} />
    </li>
    <li>
      <Button on:click={() => {listView=!listView; onClickListView()}} iconDescription={listView ? "Grid View" : "List View"} kind="ghost" icon={listView ? Grid32 : ListBoxes32} />
    </li>
    <li>
      <Button
        on:click={onClickAddNote}
        iconDescription="Create Note"
        icon={Add32}
    />
    </li>
    <li>
      <Button on:click={onClickTrash} iconDescription="Trash" kind={isTrashView ? "tertiary" : "ghost"} icon={TrashCan32} />
    </li>
    <li>
      <Button on:click={onClickArchive} iconDescription="Archive" kind={isArchiveView ? "tertiary" : "ghost"} icon={Archive32} />
    </li>
    <li>
      <Button on:click={onClickSettings} iconDescription="Reminders" kind="ghost" icon={Reminder32} />
    </li>
    <li>
      <Button on:click={onClickNotes} iconDescription="Notes" kind={isNotesView ? "tertiary" : "ghost"} icon={Notebook32} />
    </li>
  </ul>
</nav>

<style>
  nav {
    border-bottom: 1px solid #eee;
    font-weight: 300;
    padding: 0 1em;
    position: fixed;
    margin-top: -10px;
    width: 100vw;
    z-index: 20;
    background: #fff;
  }

  ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row-reverse;
  }
</style>
