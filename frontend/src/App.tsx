import Form from "./features/Form/Form"
import ContextProvider from "./context/ContextProvider";
import PdfViewer from "./features/PdfViewer/PdfViewer";

const App = () => {
  return (
    <ContextProvider >
      <header className={"flex h-16 items-center border-b-2 px-3 lg:px-12 bg-blue-400"}>
        <div className="flex w-full justify-between items-center text-white font-bold text-xl">
          <a href="/">OpenCV</a>
          <nav className="flex items-center gap-5 text-sm">
            <a href="https://github.com/FarisMarouane/openCV" target="_blank" >Github</a>
          </nav>
        </div>
      </header>
      <main className={"flex relative overflow-hidden w-full bg-gray-50 h-[calc(100vh-4rem)]"} >
        <Form />
        <PdfViewer />
      </main>
    </ContextProvider>

  )
}

export default App
