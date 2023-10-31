const Wrapper = styled.div`
  /* reset */
  button {
    all: unset;
  }

  .ToastViewport {
    --viewport-padding: 25px;
    position: fixed;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    padding: var(--viewport-padding);
    gap: 10px;
    width: 390px;
    max-width: 100vw;
    margin: 0;
    list-style: none;
    z-index: 2147483647;
    outline: none;
  }

  .ToastRoot {
    background-color: white;
    border-radius: 6px;
    box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
      hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
    padding: 15px;
    display: grid;
    grid-template-areas: 'title action' 'description action';
    grid-template-columns: auto max-content;
    column-gap: 15px;
    align-items: center;
  }
  .ToastRoot[data-state='open'] {
    animation: slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ToastRoot[data-state='closed'] {
    animation: hide 100ms ease-in;
  }
  .ToastRoot[data-swipe='move'] {
    transform: translateX(var(--radix-toast-swipe-move-x));
  }
  .ToastRoot[data-swipe='cancel'] {
    transform: translateX(0);
    transition: transform 200ms ease-out;
  }
  .ToastRoot[data-swipe='end'] {
    animation: swipeOut 100ms ease-out;
  }

  @keyframes hide {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(calc(100% + var(--viewport-padding)));
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes swipeOut {
    from {
      transform: translateX(var(--radix-toast-swipe-end-x));
    }
    to {
      transform: translateX(calc(100% + var(--viewport-padding)));
    }
  }

  .ToastTitle {
    grid-area: title;
    margin-bottom: 5px;
    font-weight: 500;
    color: rgb(255, 255, 255) !important;
    font-size: 15px !important;
  }

  .ToastDescription {
    grid-area: description;
    margin: 0;
    color: rgb(255, 255, 255) !important;
    font-size: 13px !important;
    line-height: 1.3 !important;
    font-style: normal;
  }

  .ToastAction {
    grid-area: action;
  }

  .error {
    background: pink;
  }

  .success {
    background: #02b81e;
    color: white;
  }
`

const { variant, open, toggleClosed, title, description } = props

return (
  <Wrapper>
    <Toast.Provider swipeDirection="right">
      <Toast.Root className={`ToastRoot ${variant}`} open={open}>
        <Toast.Title className="ToastTitle">{title}</Toast.Title>
        <Toast.Description className="ToastDescription">
          {description}
        </Toast.Description>
        <Toast.Action className="ToastAction" asChild altText="Close">
          <button className="" onClick={() => toggleClosed()}>
            x
          </button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  </Wrapper>
)
