import { ActionContextProvider, cx, SchemaComponent, FormProvider, useActionContext } from '@nocobase/client';
import React, { useState, useCallback, useMemo } from 'react';
import { useMemoizedFn } from 'ahooks';
import { Button, Flex } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { createForm, ArrayField } from '@formily/core';
import { ISchema, useForm } from '@formily/react';
import { ArrayItems } from '@formily/antd-v5';

function useFormProviderProps() {
  return { form: useForm() };
}
const ClearItems = () => {
  const form = useForm();
  const ctx = useActionContext();

  const clearItems = useMemoizedFn(() => {
    form.setValues({
      array: [],
    });
    ctx.setFormValueChanged(true);
  });
  return (
    <Button icon={<DeleteOutlined />} onClick={clearItems} size="small">
      Clear below items
    </Button>
  );
};
export const Page = () => {
  const [editingConfig, setEditingConfig] = useState(false);
  const [formValueChanged, setFormValueChanged] = useState(false);

  const form = useMemo(() => {
    const values = {
      input: '900',
      array: [{ key: 'item1' }, { key: 'item2' }],
    };
    return createForm({
      initialValues: values,
    });
  }, []);
  const resetForm = useCallback(
    (editing) => {
      setEditingConfig(editing);
      if (!editing) {
        form.reset();
      }
    },
    [form],
  );
  const onOpenDrawer = useCallback(function (ev) {
    setEditingConfig(true);
  }, []);

  return (
    <div>
      <Button onClick={onOpenDrawer}>Open</Button>
      <ActionContextProvider
        value={{
          visible: editingConfig,
          setVisible: resetForm,
          formValueChanged,
          setFormValueChanged,
        }}
      >
        <FormProvider form={form}>
          <SchemaComponent
            scope={{
              useFormProviderProps,
            }}
            components={{
              ClearItems,
              ArrayItems,
              Flex,
            }}
            schema={{
              name: `workflow-trigger`,
              type: 'void',
              properties: {
                drawer: {
                  type: 'void',
                  title: 'drawer',
                  'x-component': 'Action.Drawer',
                  'x-decorator': 'FormV2',
                  'x-use-decorator-props': 'useFormProviderProps',
                  properties: {
                    input: {
                      type: 'sting',
                      title: 'input',
                      'x-component': 'Input',
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        layout: 'vertical',
                      },
                    },
                    clearItems: {
                      // void field 会导致 json 组件出错，改成 string
                      type: 'string',
                      title: 'Array items',
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        layout: 'vertical',
                      },
                      'x-component': 'ClearItems',
                      'x-component-props': {
                        justify: 'flex-end',
                      },
                    },
                    array: {
                      type: 'array',
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        layout: 'vertical',
                      },
                      'x-component': 'ArrayItems',
                      default: [],
                      items: {
                        type: 'object',
                        'x-component': 'Flex',
                        'x-component-props': {
                          gap: 'small',
                        },
                        properties: {
                          keyDiv: {
                            type: 'void',
                            'x-component': 'div',
                            'x-component-props': {
                              // style: {
                              //   flex: 1,
                              // },
                            },
                            properties: {
                              key: {
                                type: 'string',
                                required: true,
                                'x-decorator': 'FormItem',
                                'x-component': 'Input',
                                'x-component-props': {
                                  placeholder: 'Key path',
                                },
                              },
                            },
                          },
                          alias: {
                            type: 'string',
                            'x-decorator': 'FormItem',
                            'x-component': 'Input',
                            'x-component-props': {
                              placeholder: 'Alias',
                            },
                          },
                          remove: {
                            type: 'void',
                            'x-decorator': 'FormItem',
                            'x-component': 'ArrayItems.Remove',
                          },
                        },
                      },
                      properties: {
                        add: {
                          type: 'void',
                          title: 'Add item',
                          'x-component': 'ArrayItems.Addition',
                        },
                      },
                    },
                  },
                },
              },
            }}
          ></SchemaComponent>
        </FormProvider>
      </ActionContextProvider>
    </div>
  );
};
