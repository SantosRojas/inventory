import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal, Select } from "../../../components";
import { Save } from "lucide-react";
import type { UserExtended, UpdateUser } from "../types";
import { useNotifications } from "../../../hooks/useNotifications";
import { useUserStore } from "../store";
import { updateUserSchema, type UpdateUserFormData } from "../schemas";
import { useUserPermissions } from "../hooks";
import { useRoles } from "../hooks/useRoles";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user: UserExtended | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}) => {
  const { updateUser } = useUserStore();
  const { notifySuccess, notifyError } = useNotifications();
  const { isAdmin, isRoot,canEditUserRole, canEditUserPersonalInfo } = useUserPermissions();
  const { getRoleIdByName, isLoading: rolesLoading, roleOptions } = useRoles();

  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  if (!user) return null;

  const canEditRole = canEditUserRole(user);
  const canEditPersonalInfo = canEditUserPersonalInfo(user);

  // Roles disponibles (convertidos a opciones)
  const roleOptionsForUser = useMemo(() => {
    if (rolesLoading) return [];
    if(isRoot){
      return  roleOptions.filter((roleOption) => roleOption.name!=="Root"&&roleOption.name!=="Administradort")
    }
    else if(isAdmin){
      return roleOptions.filter((roleOption) => roleOption.name!=="Root" );
    }

    else return []
  }, [roleOptions, rolesLoading]);

  // Schema dinámico
  const dynamicSchema = useMemo(() => {
    return canEditPersonalInfo
      ? updateUserSchema.omit({ roleId: true }).partial()
      : undefined;
  }, [canEditPersonalInfo]);

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateUserFormData>({
    resolver: dynamicSchema ? zodResolver(dynamicSchema) : undefined,
    defaultValues: {
      firstName: "",
      lastName: "",
      cellPhone: "",
      email: "",
      roleId: undefined,
    },
  });

  // Resetear valores al abrir/cambiar usuario
  useEffect(() => {
    if (user && isOpen) {
      const values: Partial<UpdateUserFormData> = {};

      if (canEditPersonalInfo) {
        values.firstName = user.firstName || "";
        values.lastName = user.lastName || "";
        values.cellPhone = user.cellPhone || "";
        values.email = user.email || "";
      }

      if (canEditRole && !rolesLoading) {
        const userRoleId = getRoleIdByName(user.role || "guest");
        values.roleId = userRoleId ?? 5;
      }

      reset(values, { keepDirty: false, keepTouched: false });
    }
  }, [user?.id, isOpen, rolesLoading]);

  useEffect(() => {
    if (isOpen) setShowConfirmClose(false);
  }, [isOpen]);

  const onSubmit = async (data: UpdateUserFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const payload: UpdateUser = {};

      if (canEditPersonalInfo) {
        if (data.firstName && data.firstName.trim() !== user.firstName)
          payload.firstName = data.firstName.trim();
        if (data.lastName && data.lastName.trim() !== user.lastName)
          payload.lastName = data.lastName.trim();
        if (data.cellPhone && data.cellPhone.trim() !== user.cellPhone)
          payload.cellPhone = data.cellPhone.trim();
        if (
          data.email &&
          data.email.toLowerCase().trim() !== user.email.toLowerCase()
        ) {
          payload.email = data.email.toLowerCase().trim();
        }
      }

      if (
        canEditRole &&
        data.roleId &&
        data.roleId !==
          (user.roleId || getRoleIdByName(user.role || "guest"))
      ) {
        if (!data.roleId || data.roleId < 1) {
          notifyError("Rol inválido seleccionado");
          return;
        }
        payload.roleId = data.roleId;
      }

      if (Object.keys(payload).length === 0) {
        notifySuccess("No hay cambios que guardar");
        return;
      }

      await updateUser(user.id, payload);
      notifySuccess("Usuario actualizado exitosamente");
      reset();
      onClose();
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) notifyError(error.message);
      else notifyError("Error al actualizar el usuario");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isDirty && !isLoading) {
      setShowConfirmClose(true);
    } else {
      confirmClose();
    }
  };

  const confirmClose = () => {
    reset();
    setShowConfirmClose(false);
    onClose();
  };

  // Si no tiene permisos para editar nada → ocultar modal
  if (!canEditRole && !canEditPersonalInfo) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={
          canEditRole && !canEditPersonalInfo
            ? "Editar Rol de Usuario"
            : "Editar Usuario"
        }
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!canEditPersonalInfo && canEditRole && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-yellow-800">
                Edición administrativa
              </h3>
              <p className="mt-2 text-sm text-yellow-700">
                Como administrador, solo puedes cambiar el rol de este usuario.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {canEditPersonalInfo && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Nombre"
                        placeholder="Ingrese el nombre"
                        error={errors.firstName?.message}
                        disabled={isLoading}
                        autoComplete="given-name"
                      />
                    )}
                  />

                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Apellido"
                        placeholder="Ingrese el apellido"
                        error={errors.lastName?.message}
                        disabled={isLoading}
                        autoComplete="family-name"
                      />
                    )}
                  />
                </div>

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      label="Email"
                      placeholder="Ingrese el email"
                      error={errors.email?.message}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  )}
                />

                <Controller
                  name="cellPhone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="tel"
                      label="Teléfono"
                      placeholder="Ingrese el teléfono"
                      error={errors.cellPhone?.message}
                      disabled={isLoading}
                      autoComplete="tel"
                    />
                  )}
                />
              </>
            )}

            {canEditRole && (
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Rol"
                    items={roleOptionsForUser}
                    value={field.value ?? ""}
                    onChange={(value) => field.onChange(Number(value))}
                    error={errors.roleId?.message}
                    disabled={isLoading || roleOptionsForUser.length === 0}
                    placeholder="Seleccione un rol"
                  />
                )}
              />
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmación */}
      <Modal
        isOpen={showConfirmClose}
        onClose={() => setShowConfirmClose(false)}
        title="¿Descartar cambios?"
        size="sm"
      >
        <p className="text-sm text-gray-600">
          Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar sin
          guardar?
        </p>
        <div className="flex justify-end space-x-3 mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowConfirmClose(false)}
          >
            Seguir editando
          </Button>
          <Button type="button" variant="danger" onClick={confirmClose}>
            Descartar cambios
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default EditUserModal;
