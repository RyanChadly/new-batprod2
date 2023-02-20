import { useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from "reactflow";

import "reactflow/dist/style.css";
import { useAppSelector } from "../../store/hooks";

export const RessourcesFlow = () => {
  const ressources = useAppSelector((state) => state.ressources);
  const ressourcesNodes = ressources.map((ress, index) => ({
    id: ress.name,
    position: { x: ress.xCoord, y: ress.yCoord },
    data: { label: ress.name },
  }));

  const ressourcesEdges = ressources
    .filter((ress) => ress.child)
    .flatMap((ress) => {
      const source = ress.name;
      const targets = ress.child;

      return targets.map((target) => ({
        id: `e${source}-${target}`,
        source,
        target,
        animated: true,
      }));
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nodes, setNodes, onNodesChange] = useNodesState(ressourcesNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(ressourcesEdges);

  const onConnect = useCallback(
    (params: Edge<any> | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      style={{ flex: "auto" }}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
};
