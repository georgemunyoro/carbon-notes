<script>
  export let open = false;
  export let onClose = () => {};

  import {
    TimePicker,
    TimePickerSelect,
    SelectItem,
    Checkbox,
    ComposedModal,
    Tile,
  } from "carbon-components-svelte";

</script>

<div>
  <ComposedModal {open} on:close={onClose}>
    <Tile>
      <h6>General</h6>
      <Checkbox style="margin-top: 1rem;" labelText="Dark Mode" />
      <h6 style="margin-top: 1rem;">Reminder Defaults</h6>
      <div style="margin-top: 1rem; display: flex;">
        <TimePicker labelText="Morning" placeholder="hh:mm">
          <TimePickerSelect style="margin-bottom: 7px;">
            <SelectItem value="am" text="AM"/>
            <SelectItem value="pm" text="PM"/>
          </TimePickerSelect>
        </TimePicker>
        <TimePicker labelText="Afternoon" placeholder="hh:mm">
          <TimePickerSelect style="margin-bottom: 7px;">
            <SelectItem value="am" text="AM"/>
            <SelectItem value="pm" text="PM"/>
          </TimePickerSelect>
        </TimePicker>
        <TimePicker labelText="Evening" placeholder="hh:mm">
          <TimePickerSelect style="margin-bottom: 7px;">
            <SelectItem value="am" text="AM"/>
            <SelectItem value="pm" text="PM"/>
          </TimePickerSelect>
        </TimePicker>
      </div>
    </Tile>
  </ComposedModal>
</div>

