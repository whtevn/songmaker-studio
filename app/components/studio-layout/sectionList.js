      <section className={`space-y-2 ${width || "w-full sm:w-1/2"}`}>
        <Heading >{ title }</Heading>
        <Table className="rounded-lg shadow-md items-center border border-gray-700 rounded bg-black p-4">
          { children } 
        </Table>
      </section>

