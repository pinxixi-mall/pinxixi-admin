import { type } from 'os'
import { ReactElement, ReactNode, ReactChildren } from 'react'

export interface PaginationProps {
  current?: number;
  pageSize?: number | undefined;
  total?: number;
  pageSizeOptions?: string[];
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
  position?: TablePaginationPosition[];
  hide?: boolean;
  updateTable?(): void;
}

export interface TableProps {
  columns: {}[]; // 表头
  fetchApi?: any; // 表格列表api
  queryParams?: any; // 搜索参数
  refreshOutside?: boolean; // 从父组件刷新
  handleTableList?(list: any[]): any[]; // 处理表格数据
  pagination?: PaginationProps;
}

export interface BodyCardProps {
  title?: string;
  subTitle?: string;
  extra?: ReactNode;
  onSubmit?(values: any): void;
  onRefresh?(): void;
}

export interface UploadProps {
  fileList: any[];
  handleRemove?(newFileList: any): void;
  handleUpload?(file: any): void;
}

export interface RichTextProps {
  value?: any;
  onChange(value: any): any;
}

// 验证码
export type VerifyCodeProps = {
  width?: number;
  height?: number;
  length?: number;
}

// 用户信息
export interface UserInfoProps {
  userId?: number;
  userName?: string;
  nickName?: string;
  avatar?: string;
}

// 下拉列表项
export interface OptionProps {
  label: string;
  value: number | string
}