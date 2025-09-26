import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Roles
  const adminRole = await prisma.role.create({
    data: { name: 'ADMIN' },
  });

  // Role Permissions
  const adminPermission = await prisma.rolePermission.create({
    data: {
      roleId: adminRole.id,
      feed: true,
      delete: true,
    },
  });

  // Persons
  const person1 = await prisma.person.create({
    data: {
      name: 'João da Silva',
      email: 'joao@example.com',
      password: '123456',
      document: '12345678901',
      birthdate: new Date('1990-01-01'),
      phone: '11999999999',
      address: 'Rua Teste',
      addressNumber: '123',
      addressCity: 'Salvador',
      addressState: 'BA',
      addressZipcode: '40000-000',
    },
  });

  // Person Permission
  await prisma.personPermission.create({
    data: {
      personId: person1.id,
      rolePermissionId: adminPermission.id,
    },
  });

  // Company
  const company1 = await prisma.company.create({
    data: {
      ownerId: person1.id,
      type: 'HOMECARE',
      name: 'HomeCare Teste',
      address: 'Av. Exemplo',
      addressNumber: '456',
      addressCity: 'Salvador',
      addressState: 'BA',
      addressZipcode: '40000-001',
      document: '98765432100',
    },
  });

  // Branch
  const branch1 = await prisma.branch.create({
    data: {
      companyId: company1.id,
      name: 'Filial Principal',
      document: '11122233344',
    },
  });

  // Employee
  await prisma.employee.create({
    data: {
      personId: person1.id,
      branchId: branch1.id,
      workRole: 'Tec. Enfermagem',
      workTime: 24,
      dayOffTime: 36,
    },
  });

  // Patient
  const patientPerson = await prisma.person.create({
    data: {
      name: 'Maria Oliveira',
      email: 'maria@example.com',
      password: '123456',
      document: '10987654321',
      birthdate: new Date('1985-06-15'),
      phone: '11988888888',
      address: 'Rua Paciente',
      addressNumber: '789',
      addressCity: 'Salvador',
      addressState: 'BA',
      addressZipcode: '40000-002',
    },
  });

  await prisma.patient.create({
    data: {
      personId: patientPerson.id,
      responsibleName: 'Carlos Oliveira',
      responsibleEmail: 'carlos@example.com',
      responsiblePhone: '11977777777',
    },
  });

  console.log('Seed data inserted successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
