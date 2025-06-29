import { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { get, post, del } from "aws-amplify/api";

type Todo = {
  id: string;
  content: string;
};

function App() {
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const restOp = get({
          apiName: "myRestApi",
          path: "/items",
        });
        const { body } = await restOp.response;
        const data = await body.json();
        if (Array.isArray(data)) {
          const filtered = data.filter((item): item is Todo => item !== null);
          setTodos(filtered);
        }
      } catch (err: any) {
        console.error("Failed to fetch todos:", await err.response?.body?.text?.());
      }
    }

    fetchTodos();
  }, []);

  async function createTodo() {
    const content = window.prompt("Todo content");
    if (!content) return;

    try {
      const restOp = post({
        apiName: "myRestApi",
        path: "/items",
        options: {
          body: { content },
        },
      });

      const { body } = await restOp.response;
      const newTodo = await body.json();

      if (newTodo && typeof newTodo === "object" && "id" in newTodo && "content" in newTodo) {
        setTodos((prev) => [...prev, newTodo as Todo]);
      }
    } catch (err: any) {
      console.error("Create failed:", await err.response?.body?.text?.());
    }
  }

  async function deleteTodo(id: string) {
    try {
      await del({
        apiName: "myRestApi",
        path: `/items/${id}`,
      }).response;

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err: any) {
      console.error("Delete failed:", await err.response?.body?.text?.());
    }
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
            {todo.content}
          </li>
        ))}
      </ul>
      <div>
        ✅ Using REST API now. Try creating/deleting a todo.
        <br />
        <a href="https://docs.amplify.aws/gen2/rest">REST API docs</a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
