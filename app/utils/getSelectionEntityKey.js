const getSelectionEntityKey = (editorState) => {
  const selectionState = editorState.getSelection();
  const start = selectionState.getStartOffset();
  const blokKey = selectionState.getStartKey();
  return editorState
    .getCurrentContent()
    .getBlockForKey(blokKey)
    .getEntityAt(start);
};

export default getSelectionEntityKey;
