import { port } from "./configs/config";

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
