import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ClientesService } from '../../../services/service-empresas';
import type { GeneriResp } from '../../../interfaces';
import { finalize, mergeMap, of } from 'rxjs';
import { NotificationService } from '../../../utils/services';

export interface ClienteState {
  clientes: GeneriResp<any>;
  loading: boolean;
  ideCliente: number | null;
  isModalOpen: Record<string, boolean>;
  numElementsByPage: number;
  totalElements: number;
}

const initialState: ClienteState = {
  clientes: {
    data: {
      empty: false,
      listData: [],
      page: {},
    },
    message: '',
    status: '',
    code: null,
  },
  loading: false,
  ideCliente: null,
  isModalOpen: {},
  numElementsByPage: 10,
  totalElements: 0,
};

export const CLIENTE_INITIAL_STATE = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => {
    const clienteService = inject(ClientesService);
    const notification = inject(NotificationService);

    return {
      ideCustomer: (ide: number, modalName: string) =>
        patchState(store, { ideCliente: ide, isModalOpen: { ...store.isModalOpen, [modalName]: true } }),

      openModal: (modalName: string) =>
        patchState(store, { isModalOpen: { ...store.isModalOpen(), [modalName]: true } }),

      closeModal: (modalName: string) =>
        patchState(store, { isModalOpen: { ...store.isModalOpen(), [modalName]: false } }),

      listCustom: (filter: any) => {
        of(patchState(store, { loading: true }))
          .pipe(
            mergeMap(() => clienteService.listClientes(filter)),
            finalize(() => {
              patchState(store, { loading: false });
            }),
          )
          .subscribe((resp) => {
            if (resp.status === 'OK') {
              console.log(resp);
              patchState(store, { clientes: resp });
              patchState(store, { numElementsByPage: resp.data.page.numElementsByPage });
              patchState(store, { totalElements: resp.data.page.totalElements });
            }
          });
      },

      deleteCustomer: () => {
        of(patchState(store, { loading: true }))
          .pipe(
            mergeMap(() => clienteService.deleteCustomer(store.ideCliente()!)),
            finalize(() => {
              patchState(store, { loading: false, ideCliente: null });
            }),
          )
          .subscribe((resp) => {
            if (resp.status === 'OK') {
              const currentCliente = store.clientes();
              if (!currentCliente?.data?.listData) return;
              const deleteCustom = {
                ...currentCliente,
                data: {
                  ...currentCliente.data,
                  listData: currentCliente!.data!.listData!.filter(
                    (cliente: any) => cliente.ideCustomer !== store.ideCliente(),
                  ),
                },
              };

              patchState(store, { clientes: deleteCustom, isModalOpen: { ...store.isModalOpen, delete: false } });
              notification.push({
                message: 'Cliente eliminado del registro.',
                type: 'success',
              });
            }
          });
      },

      createCustomer: (updateByInfoPersona: any) => {
        of(patchState(store, { loading: true }))
          .pipe(
            mergeMap(() => clienteService.addCustomer(updateByInfoPersona)),
            finalize(() => patchState(store, { loading: false })),
          )
          .subscribe((res) => {
            if (res.status === 'OK') {
              const data = {
                ideCustomer: Number(res.data),
                ...updateByInfoPersona,
              };

              const currentCliente = store.clientes();
              if (!currentCliente?.data?.listData) return;

              const updatedCliente = {
                ...currentCliente,
                data: {
                  ...currentCliente.data,
                  listData: [...currentCliente.data.listData, data],
                },
              }

              patchState(store, {
                clientes: updatedCliente,
                isModalOpen: { ...store.isModalOpen, create: false },
              });
              notification.push({
                message: 'El cliente ha sido creado con éxito.',
                type: 'success',
              });
            }
          });
      },
    };
  }),
);
