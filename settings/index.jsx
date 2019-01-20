function settingsComponent(props) {

  return (
    <Page>
      <Section
        title={
          <Text bold align="center">
            Probe Settings
          </Text>
        }
      description="Created mainly to allow triggering the companion launch."
      />

      <Slider
        label="Resolution (seconds)"
        settingsKey="resolution"
        min="1"
        max="10"
        step="1"
      />

      <Button
        label="Reset settings"
        onClick={() => props.settingsStorage.clear()}
      />

    </Page>
  );
}

registerSettingsPage(settingsComponent)
