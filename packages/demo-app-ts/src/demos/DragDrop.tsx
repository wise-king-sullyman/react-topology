import * as React from 'react';
import {
  Model,
  Node,
  ModelKind,
  withDndDrag,
  Modifiers,
  withDndDrop,
  GraphComponent,
  withPanZoom,
  DragObjectWithType,
  withDragNode,
  useModel,
  useComponentFactory,
  ComponentFactory
} from '@patternfly/react-topology';
import defaultComponentFactory from '../components/defaultComponentFactory';
import DemoDefaultNode from '../components/DemoDefaultNode';
import GroupHull from '../components/GroupHull';
import withTopologySetup from '../utils/withTopologySetup';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';

interface ElementProps {
  element: Node;
}

export const Dnd = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  // support pan zoom and drag
  useComponentFactory(
    React.useCallback<ComponentFactory>((kind, type) => {
      if (kind === ModelKind.graph) {
        return withPanZoom()(GraphComponent);
      }
      if (type === 'group-drop') {
        return withDndDrop<Node, any, { droppable?: boolean; hover?: boolean; canDrop?: boolean }, ElementProps>({
          accept: 'test',
          canDrop: (item, monitor, props) => !!props && item.getParent() !== props.element,
          collect: monitor => ({
            droppable: monitor.isDragging(),
            hover: monitor.isOver(),
            canDrop: monitor.canDrop()
          })
        })(GroupHull);
      }
      if (type === 'node-drag') {
        return withDndDrag<DragObjectWithType, Node, {}, ElementProps>({
          item: { type: 'test' },
          begin: (monitor, props) => {
            props.element.raise();
            return props.element;
          },
          drag: (event, monitor, props) => {
            props.element.setPosition(
              props.element
                .getPosition()
                .clone()
                .translate(event.dx, event.dy)
            );
          },
          end: (dropResult, monitor, props) => {
            if (monitor.didDrop() && dropResult && props) {
              dropResult.appendChild(props.element);
            }
          }
        })(DemoDefaultNode);
      }
      return undefined;
    }, [])
  );
  useModel(
    React.useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: [
          {
            id: 'gr1',
            type: 'group-drop',
            group: true,
            children: ['n2', 'n3'],
            style: {
              padding: 10
            }
          },
          {
            id: 'gr2',
            type: 'group-drop',
            group: true,
            children: ['n4', 'n5'],
            style: {
              padding: 10
            }
          },
          {
            id: 'n1',
            type: 'node-drag',
            x: 50,
            y: 50,
            width: 30,
            height: 30
          },
          {
            id: 'n2',
            type: 'node',
            x: 200,
            y: 20,
            width: 10,
            height: 10
          },
          {
            id: 'n3',
            type: 'node',
            x: 150,
            y: 100,
            width: 20,
            height: 20
          },
          {
            id: 'n4',
            type: 'node',
            x: 300,
            y: 250,
            width: 30,
            height: 30
          },
          {
            id: 'n5',
            type: 'node',
            x: 350,
            y: 370,
            width: 15,
            height: 15
          }
        ]
      }),
      []
    )
  );
  return null;
});

export const DndShiftRegroup = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  // support pan zoom and drag
  useComponentFactory(
    React.useCallback<ComponentFactory>((kind, type) => {
      if (kind === ModelKind.graph) {
        return withPanZoom()(GraphComponent);
      }
      if (type === 'group-drop') {
        return withDndDrop<Node, any, { droppable?: boolean; hover?: boolean; canDrop?: boolean }, ElementProps>({
          accept: 'test',
          canDrop: (item, monitor, props) =>
            item && monitor.getOperation().type === 'regroup' && !!props && item.getParent() !== props.element,
          collect: monitor => ({
            droppable: monitor.isDragging() && monitor.getOperation().type === 'regroup',
            hover: monitor.isOver(),
            canDrop: monitor.canDrop()
          })
        })(GroupHull);
      }
      if (type === 'node-drag') {
        return withDragNode<DragObjectWithType, Node, {}, ElementProps>({
          item: { type: 'test' },
          operation: () => ({
            [Modifiers.SHIFT]: { type: 'regroup' }
          }),
          end: (dropResult, monitor, props) => {
            if (monitor.didDrop() && dropResult && props) {
              dropResult.appendChild(props.element);
            }
          }
        })(DemoDefaultNode);
      }
      return undefined;
    }, [])
  );
  useModel(
    React.useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: [
          {
            id: 'gr1',
            type: 'group-drop',
            group: true,
            children: ['n2', 'n3'],
            style: {
              padding: 10
            }
          },
          {
            id: 'gr2',
            type: 'group-drop',
            group: true,
            children: ['n4', 'n5'],
            style: {
              padding: 10
            }
          },
          {
            id: 'n1',
            type: 'node-drag',
            x: 50,
            y: 50,
            width: 30,
            height: 30
          },
          {
            id: 'n2',
            type: 'node',
            x: 200,
            y: 20,
            width: 10,
            height: 10
          },
          {
            id: 'n3',
            type: 'node',
            x: 150,
            y: 100,
            width: 20,
            height: 20
          },
          {
            id: 'n4',
            type: 'node',
            x: 300,
            y: 250,
            width: 30,
            height: 30
          },
          {
            id: 'n5',
            type: 'node',
            x: 350,
            y: 370,
            width: 15,
            height: 15
          }
        ]
      }),
      []
    )
  );
  return null;
});

export const DragAndDrop: React.FunctionComponent = () => {
  const [activeKey, setActiveKey] = React.useState<number>(0);

  const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: number) => {
    setActiveKey(tabIndex);
  };

  return (
    <div className="pf-ri__topology-demo">
      <Tabs unmountOnExit activeKey={activeKey} onSelect={handleTabClick}>
        <Tab eventKey={0} title={<TabTitleText>Dnd</TabTitleText>}>
          <Dnd />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Dnd Shift Regroup</TabTitleText>}>
          <DndShiftRegroup />
        </Tab>
      </Tabs>
    </div>
  );
};
